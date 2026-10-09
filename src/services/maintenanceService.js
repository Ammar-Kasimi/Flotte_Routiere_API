const RegleMaintenance = require('../models/RegleMaintenance');
const AlerteMaintenance = require('../models/AlerteMaintenance');
const Camion = require('../models/Camion');
const Remorque = require('../models/Remorque');
const pneuRepository = require('../repositories/PneuRepository');

class MaintenanceService {
    async configurerRegle(data) {
        const regle = await RegleMaintenance.findOneAndUpdate(
            { typeOperation: data.typeOperation },
            { periodiciteKm: data.periodiciteKm },
            { new: true, upsert: true }
        );

        const camions = await Camion.find({ estArchive: false });
        const remorques = await Remorque.find({ estArchive: false });
        
        for (const camion of camions) {
            await this.verifierSeuils(camion._id, null);
        }
        for (const remorque of remorques) {
            await this.verifierSeuils(null, remorque._id);
        }

        return regle;
    }

    async getRegles() {
        return await RegleMaintenance.find();
    }

    async getAlertes(estTraitee) {
        const query = {};
        if (estTraitee !== undefined) {
            query.estTraitee = estTraitee === 'true';
        }
        return await AlerteMaintenance.find(query)
            .populate('vehiculeId', 'immatriculation marque')
            .populate('pneu', 'position');
    }

    async traiterAlerte(alerteId) {
        const alerteExistante = await AlerteMaintenance.findById(alerteId);
        if (!alerteExistante) {
            const error = new Error('Alerte introuvable');
            error.status = 404;
            throw error;
        }
        if (alerteExistante.estTraitee) {
            const error = new Error('Cette alerte est déjà traitée');
            error.status = 409;
            throw error;
        }

        const alerte = await AlerteMaintenance.findByIdAndUpdate(
            alerteId, 
            { estTraitee: true }, 
            { new: true }
        );

        if (alerte.typeOperation === 'PNEUS') {
            await pneuRepository.update(alerte.pneu, { kilometrageActuel: 0, etat: 'NEUF' });
        } else if (alerte.typeVehicule === 'Camion') {
            const updateField = alerte.typeOperation === 'VIDANGE' ? 'kilometrageDerniereVidange' : 'kilometrageDerniereRevision';
            await Camion.findByIdAndUpdate(alerte.vehiculeId, { [updateField]: alerte.kilometrageAuDeclenchement });
        } else if (alerte.typeVehicule === 'Remorque' && alerte.typeOperation === 'REVISION') {
            await Remorque.findByIdAndUpdate(alerte.vehiculeId, { kilometrageDerniereRevision: alerte.kilometrageAuDeclenchement });
        }

        return alerte;
    }

    async verifierSeuils(camionId, remorqueId) {
        const regles = await RegleMaintenance.find();
        if (regles.length === 0) return;

        if (camionId) {
            const camion = await Camion.findById(camionId);
            for (const regle of regles) {
                if (regle.typeOperation === 'VIDANGE' && (camion.kilometrageCumule - camion.kilometrageDerniereVidange) >= regle.periodiciteKm) {
                    await this._creerAlerte(camion._id, 'Camion', 'VIDANGE', camion.kilometrageCumule);
                }
                if (regle.typeOperation === 'REVISION' && (camion.kilometrageCumule - camion.kilometrageDerniereRevision) >= regle.periodiciteKm) {
                    await this._creerAlerte(camion._id, 'Camion', 'REVISION', camion.kilometrageCumule);
                }
            }
            
            const reglePneus = regles.find(r => r.typeOperation === 'PNEUS');
            if (reglePneus) {
                const pneus = await pneuRepository.findByCamion(camion._id);
                for (const pneu of pneus) {
                    if (pneu.kilometrageActuel >= reglePneus.periodiciteKm) {
                        await pneuRepository.update(pneu._id, { etat: 'A_REMPLACER' });
                        await this._creerAlerte(camion._id, 'Camion', 'PNEUS', pneu.kilometrageActuel, pneu._id);
                    }
                }
            }
        }

        if (remorqueId) {
            const remorque = await Remorque.findById(remorqueId);
            const regleRevision = regles.find(r => r.typeOperation === 'REVISION');
            if (regleRevision && (remorque.kilometrageCumule - remorque.kilometrageDerniereRevision) >= regleRevision.periodiciteKm) {
                await this._creerAlerte(remorque._id, 'Remorque', 'REVISION', remorque.kilometrageCumule);
            }
        }
    }

    async _creerAlerte(vehiculeId, typeVehicule, typeOperation, kmActuel, pneuId = null) {
        const filtre = { vehiculeId, typeOperation, estTraitee: false };
        if (pneuId) filtre.pneu = pneuId;
        
        const alerteExistante = await AlerteMaintenance.findOne(filtre);

        if (!alerteExistante) {
            await AlerteMaintenance.create({
                vehiculeId,
                typeVehicule,
                typeOperation,
                kilometrageAuDeclenchement: kmActuel,
                pneu: pneuId
            });
        }
    }
}

module.exports = new MaintenanceService();