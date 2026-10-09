const Pneu = require('../models/Pneu');

class PneuRepository {
    async create(data) {
        return await Pneu.create(data);
    }

    async findByCamion(camionId) {
        return await Pneu.find({ camion: camionId });
    }

    async findById(id) {
        return await Pneu.findById(id);
    }

    async update(id, data) {
        return await Pneu.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return await Pneu.findByIdAndDelete(id);
    }
}

module.exports = new PneuRepository();