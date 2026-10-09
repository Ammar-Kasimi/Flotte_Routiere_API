const pneuRepository = require('../repositories/PneuRepository');
const camionRepository = require('../repositories/CamionRepository');

class PneuService {
    async createPneu(data) {
        const camion = await camionRepository.findById(data.camion);
        if (!camion) {
            const error = new Error('Camion introuvable ou archivé');
            error.status = 404;
            throw error;
        }

        try {
            return await pneuRepository.create(data);
        } catch (err) {
            // Catch MongoDB's unique index violation
            if (err.code === 11000) {
                const error = new Error('Ce camion possède déjà un pneu à cette position');
                error.status = 409;
                throw error;
            }
            throw err; 
        }
    }

    async getPneusByCamion(camionId) {
        return await pneuRepository.findByCamion(camionId);
    }

    async updatePneu(id, data) {
        const pneu = await pneuRepository.findById(id);
        if (!pneu) {
            const error = new Error('Pneu introuvable');
            error.status = 404;
            throw error;
        }
        return await pneuRepository.update(id, data);
    }
}

module.exports = new PneuService();