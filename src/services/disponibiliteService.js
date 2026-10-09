const UtilisateurRepository = require('../repositories/UtilisateurRepository');
const CamionRepository = require('../repositories/CamionRepository');
const RemorqueRepository = require('../repositories/RemorqueRepository');
const TrajetRepository = require('../repositories/TrajetRepository');
const AlerteMaintenance = require('../models/AlerteMaintenance');

class DisponibiliteService {
    async verifierDisponibilite({ chauffeurId, camionId, remorqueId, dateDebut, dateFin, trajetIdExclu = null }) {
        const debut = new Date(dateDebut);
        const fin = new Date(dateFin);

        if (debut >= fin) {
            const error = new Error('La date de début doit être antérieure à la date de fin');
            error.status = 400;
            throw error;
        }
        
        if (chauffeurId) {
            const chauffeur = await UtilisateurRepository.findById(chauffeurId);
            if (!chauffeur) {
                const error = new Error('Chauffeur introuvable');
                error.status = 404;
                throw error;
            }
            if (chauffeur.statutCompte === 'SUSPENDU') {
                const error = new Error('Le compte du chauffeur est suspendu');
                error.status = 403;
                throw error;
            }
        }
        
        if (camionId) {
            const camion = await CamionRepository.findById(camionId);
            if (!camion) {
                const error = new Error('Camion introuvable');
                error.status = 404;
                throw error;
            }
            if (camion.statut === 'EN_MAINTENANCE' || camion.estArchive) {
                const error = new Error('Le camion est archivé ou en maintenance');
                error.status = 409;
                throw error;
            }
            const alerteCamion = await AlerteMaintenance.findOne({ vehiculeId: camionId, estTraitee: false });
            if (alerteCamion) {
                const error = new Error('Assignation impossible : Le camion possède une alerte de maintenance non traitée');
                error.status = 409;
                throw error;
            }
        }
        
        if (remorqueId) {
            const remorque = await RemorqueRepository.findById(remorqueId);
            if (!remorque) {
                const error = new Error('Remorque introuvable');
                error.status = 404;
                throw error;
            }
            if (remorque.statut === 'EN_MAINTENANCE' || remorque.estArchive) {
                const error = new Error('La remorque est archivée ou en maintenance');
                error.status = 409;
                throw error;
            }
            const alerteRemorque = await AlerteMaintenance.findOne({ vehiculeId: remorqueId, estTraitee: false });
            if (alerteRemorque) {
                const error = new Error('Assignation impossible : La remorque possède une alerte de maintenance non traitée');
                error.status = 409;
                throw error;
            }
        }

        const conditions = [];
        if (chauffeurId) conditions.push({ chauffeur: chauffeurId });
        if (camionId) conditions.push({ camion: camionId });
        if (remorqueId) conditions.push({ remorque: remorqueId });

        if (conditions.length > 0) {
            const conflit = await TrajetRepository.findConflictingTrajets(conditions, debut, fin, trajetIdExclu);
            if (conflit) {
                const error = new Error('Conflit d\'assignation : ressource déjà occupée sur cette période');
                error.status = 409;
                throw error;
            }
        }
        
        return true;
    }
}

module.exports = new DisponibiliteService();