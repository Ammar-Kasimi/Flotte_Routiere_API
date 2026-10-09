const Trajet = require('../models/Trajet');

class TrajetRepository {
    async create(data) {
        return await Trajet.create(data);
    }

    async findAll() {
        return await Trajet.find()
            .populate('chauffeur', 'nom email statutCompte')
            .populate('camion', 'immatriculation marque modele statut')
            .populate('remorque', 'immatriculation capacite statut');
    }

    async findById(id) {
        return await Trajet.findById(id)
            .populate('chauffeur', 'nom email statutCompte')
            .populate('camion', 'immatriculation marque modele statut')
            .populate('remorque', 'immatriculation capacite statut');
    }

    async findByChauffeur(chauffeurId) {
        return await Trajet.find({ chauffeur: chauffeurId })
            .populate('camion', 'immatriculation marque modele')
            .populate('remorque', 'immatriculation capacite');
    }

    async update(id, data) {
        return await Trajet.findByIdAndUpdate(id, data, { new: true });
    }

    async findConflictingTrajets(conditions, dateDebut, dateFin, trajetIdExclu = null) {
        const query = {
            statut: { $in: ['A_FAIRE', 'EN_COURS'] },
            dateDebutPrevue: { $lt: dateFin },
            dateFinPrevue: { $gt: dateDebut },
            $or: conditions
        };
        if (trajetIdExclu) {
            query._id = { $ne: trajetIdExclu };
        }
        return await Trajet.findOne(query);
    }

    async updateSiStatut(id, statutAttendu, data) {
        return await Trajet.findOneAndUpdate({ _id: id, statut: statutAttendu }, data, { new: true });
    }

    async delete(id) {
        return await Trajet.findByIdAndDelete(id);
    }
}

module.exports = new TrajetRepository();