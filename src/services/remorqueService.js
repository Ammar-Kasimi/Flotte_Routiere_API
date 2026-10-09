const remorqueRepository = require('../repositories/RemorqueRepository');

class RemorqueService {
    async createRemorque(donnees) {
        const existingRemorque = await remorqueRepository.findByImmatriculation(donnees.immatriculation);
        if (existingRemorque) {
            const error = new Error('Une remorque avec cette immatriculation existe déjà');
            error.status = 409; 
            throw error;
        }

        return await remorqueRepository.create(donnees);
    }

    async getAllRemorques() {
        return await remorqueRepository.findAll();
    }

    async getRemorqueById(id) {
        const remorque = await remorqueRepository.findById(id);
        if (!remorque) {
            const error = new Error('Remorque introuvable');
            error.status = 404;
            throw error;
        }
        return remorque;
    }

    async updateRemorque(id, donnees) {
        await this.getRemorqueById(id);
        return await remorqueRepository.update(id, donnees);
    }

    async archiveRemorque(id) {
        await this.getRemorqueById(id);
        return await remorqueRepository.softDelete(id);
    }
}

module.exports = new RemorqueService();