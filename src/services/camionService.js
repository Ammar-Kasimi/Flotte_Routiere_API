const camionRepository = require('../repositories/CamionRepository');

class CamionService {
    async createCamion(donnees) {
        const existingCamion = await camionRepository.findByImmatriculation(donnees.immatriculation);
        if (existingCamion) {
            const error = new Error('Un camion avec cette immatriculation existe déjà');
            error.status = 409;
            throw error;
        }
        return await camionRepository.create(donnees);
    }

    async getAllCamions() {
        return await camionRepository.findAll();
    }

    async getCamionById(id) {
        const camion = await camionRepository.findById(id);
        if (!camion) {
            const error = new Error('Camion introuvable');
            error.status = 404;
            throw error;
        }
        return camion;
    }

    async updateCamion(id, donnees) {
        await this.getCamionById(id);
        return await camionRepository.update(id, donnees);
    }

    async archiveCamion(id) {
        await this.getCamionById(id);
        return await camionRepository.softDelete(id);
    }
}

module.exports = new CamionService();valida