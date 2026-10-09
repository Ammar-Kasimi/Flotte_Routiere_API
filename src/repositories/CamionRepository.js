const Camion = require('../models/Camion');

class CamionRepository {
    async create(data) {
        return await Camion.create(data);
    }

    async findAll() {
        return await Camion.find({ estArchive: false });
    }

    async findById(id) {
        return await Camion.findOne({ _id: id, estArchive: false });
    }

    async findByImmatriculation(immatriculation) {
        return await Camion.findOne({ immatriculation, estArchive: false });
    }

    async update(id, data) {
        return await Camion.findByIdAndUpdate(id, data, { new: true });
    }

    async softDelete(id) {
        return await Camion.findByIdAndUpdate(id, { estArchive: true }, { new: true });
    }
}

module.exports = new CamionRepository();