const Remorque = require('../models/Remorque');

class RemorqueRepository {
    async create(data) {
        return await Remorque.create(data);
    }

    async findAll() {
        return await Remorque.find({ estArchive: false });
    }

    async findById(id) {
        return await Remorque.findOne({ _id: id, estArchive: false });
    }

    async findByImmatriculation(immatriculation) {
        return await Remorque.findOne({ immatriculation, estArchive: false });
    }

    async update(id, data) {
        return await Remorque.findByIdAndUpdate(id, data, { new: true });
    }

    async softDelete(id) {
        return await Remorque.findByIdAndUpdate(id, { estArchive: true }, { new: true });
    }
}

module.exports = new RemorqueRepository();