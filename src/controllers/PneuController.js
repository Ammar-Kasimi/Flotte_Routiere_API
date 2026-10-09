const pneuService = require('../services/pneuService');

class PneuController {
    async create(req, res, next) {
        try {
            const pneu = await pneuService.createPneu(req.body);
            res.status(201).json({
                success: true,
                data: pneu
            });
        } catch (error) {
            next(error);
        }
    }

    async getByCamion(req, res, next) {
        try {
            const pneus = await pneuService.getPneusByCamion(req.params.camionId);
            res.status(200).json({
                success: true,
                data: pneus
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const pneu = await pneuService.updatePneu(req.params.id, req.body);
            res.status(200).json({
                success: true,
                data: pneu
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new PneuController();