const remorqueService = require('../services/remorqueService');

class RemorqueController {
    async create(req, res, next) {
        try {
            const remorque = await remorqueService.createRemorque(req.body);
            res.status(201).json({ success: true, data: remorque });
        } catch (error) {
            next(error);
        }
    }

    async getAll(req, res, next) {
        try {
            const remorques = await remorqueService.getAllRemorques();
            res.status(200).json({ success: true, data: remorques });
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const remorque = await remorqueService.getRemorqueById(req.params.id);
            res.status(200).json({ success: true, data: remorque });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const remorque = await remorqueService.updateRemorque(req.params.id, req.body);
            res.status(200).json({ success: true, data: remorque });
        } catch (error) {
            next(error);
        }
    }

    async archive(req, res, next) {
        try {
            const remorque = await remorqueService.archiveRemorque(req.params.id);
            res.status(200).json({ success: true, message: 'Remorque archivée avec succès', data: remorque });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new RemorqueController();