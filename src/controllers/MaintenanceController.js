const maintenanceService = require('../services/maintenanceService');

class MaintenanceController {
    async configurerRegle(req, res, next) {
        try {
            const regle = await maintenanceService.configurerRegle(req.body);
            res.status(200).json({ success: true, data: regle });
        } catch (error) {
            next(error);
        }
    }

    async getRegles(req, res, next) {
        try {
            const regles = await maintenanceService.getRegles();
            res.status(200).json({ success: true, data: regles });
        } catch (error) {
            next(error);
        }
    }

    async getAlertes(req, res, next) {
        try {
            const { estTraitee } = req.query;
            const alertes = await maintenanceService.getAlertes(estTraitee);
            res.status(200).json({ success: true, data: alertes });
        } catch (error) {
            next(error);
        }
    }

    async traiterAlerte(req, res, next) {
        try {
            const alerte = await maintenanceService.traiterAlerte(req.params.id);
            res.status(200).json({ success: true, data: alerte });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new MaintenanceController();