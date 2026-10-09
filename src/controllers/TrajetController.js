const trajetService = require('../services/trajetService');
const pdfService = require('../services/pdfService');

class TrajetController {
    async create(req, res, next) {
        try {
            const trajet = await trajetService.createTrajet(req.body);
            res.status(201).json({ success: true, data: trajet });
        } catch (error) {
            next(error);
        }
    }

    async getAll(req, res, next) {
        try {
            const trajets = await trajetService.getAllTrajets();
            res.status(200).json({ success: true, data: trajets });
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const trajet = await trajetService.getTrajetById(req.params.id);
            res.status(200).json({ success: true, data: trajet });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const trajet = await trajetService.updateTrajet(req.params.id, req.body);
            res.status(200).json({ success: true, data: trajet });
        } catch (error) {
            next(error);
        }
    }

    async getMesTrajets(req, res, next) {
        try {
            const trajets = await trajetService.getMesTrajets(req.user.id);
            res.status(200).json({ success: true, data: trajets });
        } catch (error) {
            next(error);
        }
    }

    async saisirDonneesFin(req, res, next) {
        try {
            const trajet = await trajetService.saisirDonneesFin(req.params.id, req.user.id, req.body);
            res.status(200).json({ success: true, data: trajet });
        } catch (error) {
            next(error);
        }
    }

    async updateStatutChauffeur(req, res, next) {
        try {
            const trajet = await trajetService.updateStatutChauffeur(req.params.id, req.user.id, req.body.statut);
            res.status(200).json({ success: true, data: trajet });
        } catch (error) {
            next(error);
        }
    }

    async updateStatutAdmin(req, res, next) {
        try {
            const trajet = await trajetService.updateStatutAdmin(req.params.id, req.body.statut);
            res.status(200).json({ success: true, data: trajet });
        } catch (error) {
            next(error);
        }
    }

    async downloadPDF(req, res, next) {
        try {
            const trajet = await trajetService.getTrajetById(req.params.id);
            
            if (req.user.role === 'CHAUFFEUR') {
                if (!trajet.chauffeur || trajet.chauffeur._id.toString() !== req.user.id.toString()) {
                    const error = new Error('Accès interdit : ce trajet ne vous est pas assigné');
                    error.status = 403;
                    throw error;
                }
            }
            
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=ordre_mission_${trajet._id}.pdf`);
            
            pdfService.genererOrdreMission(trajet, res);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new TrajetController();