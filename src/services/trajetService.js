const TrajetRepository = require('../repositories/TrajetRepository');
const disponibiliteService = require('./disponibiliteService');
const calculService = require('./calculService');
const CamionRepository = require('../repositories/CamionRepository');
const RemorqueRepository = require('../repositories/RemorqueRepository');
const pneuRepository = require('../repositories/PneuRepository');
const maintenanceService = require('./maintenanceService');

let fileAttente = Promise.resolve();

class TrajetService {
    async _executerEnExclusivite(operation) {
        const precedent = fileAttente;
        let liberer;
        fileAttente = new Promise(resolve => { liberer = resolve; });
        await precedent;
        try {
            return await operation();
        } finally {
            liberer();
        }
    }

    async createTrajet(data) {
        return await this._executerEnExclusivite(async () => {
            await disponibiliteService.verifierDisponibilite({
                chauffeurId: data.chauffeur,
                camionId: data.camion,
                remorqueId: data.remorque,
                dateDebut: data.dateDebutPrevue,
                dateFin: data.dateFinPrevue
            });
            return await TrajetRepository.create(data);
        });
    }

    async getAllTrajets() {
        return await TrajetRepository.findAll();
    }

    async getTrajetById(id) {
        const trajet = await TrajetRepository.findById(id);
        if (!trajet) {
            const error = new Error('Trajet introuvable');
            error.status = 404;
            throw error;
        }
        return trajet;
    }

    async updateTrajet(id, data) {
        return await this._executerEnExclusivite(async () => {
            const existingTrajet = await this.getTrajetById(id);

            if (existingTrajet.statut === 'TERMINE') {
                const error = new Error('Impossible de modifier un trajet déjà terminé.');
                error.status = 400;
                throw error;
            }

            const debut = data.dateDebutPrevue || existingTrajet.dateDebutPrevue;
            const fin = data.dateFinPrevue || existingTrajet.dateFinPrevue;
            const chauffeur = data.chauffeur !== undefined ? data.chauffeur : existingTrajet.chauffeur;
            const camion = data.camion !== undefined ? data.camion : existingTrajet.camion;
            const remorque = data.remorque !== undefined ? data.remorque : existingTrajet.remorque;

            await disponibiliteService.verifierDisponibilite({
                chauffeurId: chauffeur,
                camionId: camion,
                remorqueId: remorque,
                dateDebut: debut,
                dateFin: fin,
                trajetIdExclu: id
            });

            return await TrajetRepository.update(id, data);
        });
    }

    async getMesTrajets(chauffeurId) {
        return await TrajetRepository.findByChauffeur(chauffeurId);
    }

    async updateStatutChauffeur(trajetId, chauffeurId, nouveauStatut) {
        const trajet = await TrajetRepository.findById(trajetId);
        if (!trajet) {
            const error = new Error('Trajet introuvable');
            error.status = 404;
            throw error;
        }
        if (!trajet.chauffeur || trajet.chauffeur._id.toString() !== chauffeurId.toString()) {
            const error = new Error('Accès interdit : ce trajet ne vous est pas assigné');
            error.status = 403;
            throw error;
        }

        if (nouveauStatut === 'EN_COURS') {
            if (!trajet.camion || !trajet.remorque) {
                const error = new Error('Impossible de démarrer un trajet sans camion et remorque assignés');
                error.status = 400;
                throw error;
            }
            
            const updated = await TrajetRepository.updateSiStatut(trajetId, 'A_FAIRE', { 
                statut: nouveauStatut, 
                dateDebutReelle: new Date() 
            });
            
            if (!updated) {
                const error = new Error('Transition de statut invalide ou trajet déjà modifié.');
                error.status = 400;
                throw error;
            }
            return updated;
        }

        if (nouveauStatut === 'TERMINE') {
            if (trajet.kilometrageDepart == null || trajet.kilometrageArrivee == null) {
                const error = new Error('Vous devez d\'abord saisir les kilométrages');
                error.status = 400;
                throw error;
            }
            
            const distance = calculService.calculerDistance(trajet.kilometrageDepart, trajet.kilometrageArrivee);
            const updateData = { statut: nouveauStatut, dateFinReelle: new Date() };
            
            if (trajet.volumeGasoil) {
                updateData.consommationMoyenne = calculService.calculerConsommationMoyenne(distance, trajet.volumeGasoil);
            }

            const updated = await TrajetRepository.updateSiStatut(trajetId, 'EN_COURS', updateData);
            
            if (!updated) {
                const error = new Error('Transition de statut invalide ou trajet déjà modifié.');
                error.status = 400;
                throw error;
            }
            
            if (trajet.camion) {
                await CamionRepository.update(trajet.camion._id, {
                    $inc: { kilometrageCumule: distance }
                });

                const pneus = await pneuRepository.findByCamion(trajet.camion._id);
                for (const pneu of pneus) {
                    if (pneu.position !== 'SECOURS') {
                        await pneuRepository.update(pneu._id, {
                            $inc: { kilometrageActuel: distance }
                        });
                    }
                }
            }
            
            if (trajet.remorque) {
                await RemorqueRepository.update(trajet.remorque._id, {
                    $inc: { kilometrageCumule: distance }
                });
            }

            await maintenanceService.verifierSeuils(trajet.camion?._id, trajet.remorque?._id);
            return updated;
        }

        const error = new Error('Statut demandé invalide');
        error.status = 400;
        throw error;
    }

    async saisirDonneesFin(trajetId, chauffeurId, data) {
        const trajet = await TrajetRepository.findById(trajetId);
        if (!trajet) {
            const error = new Error('Trajet introuvable');
            error.status = 404;
            throw error;
        }
        if (!trajet.chauffeur || trajet.chauffeur._id.toString() !== chauffeurId.toString()) {
            const error = new Error('Accès interdit : ce trajet ne vous est pas assigné');
            error.status = 403;
            throw error;
        }
        if (trajet.statut !== 'EN_COURS') {
            const error = new Error('Les données ne peuvent être saisies que pour un trajet en cours');
            error.status = 400;
            throw error;
        }
        
        calculService.calculerDistance(data.kilometrageDepart, data.kilometrageArrivee);

        return await TrajetRepository.update(trajetId, {
            kilometrageDepart: data.kilometrageDepart,
            kilometrageArrivee: data.kilometrageArrivee,
            volumeGasoil: data.volumeGasoil,
            coutCarburant: data.coutCarburant,
            remarqueChauffeur: data.remarqueChauffeur
        });
    }

    async updateStatutAdmin(trajetId, nouveauStatut) {
        const trajet = await this.getTrajetById(trajetId);
        
        if (trajet.statut === 'TERMINE' || nouveauStatut === 'TERMINE') {
            const error = new Error('Le statut TERMINE ne peut pas être modifié ni forcé par l\'admin : le kilométrage est déjà comptabilisé.');
            error.status = 400;
            throw error;
        }
        return await TrajetRepository.update(trajetId, { statut: nouveauStatut });
    }
}

module.exports = new TrajetService();