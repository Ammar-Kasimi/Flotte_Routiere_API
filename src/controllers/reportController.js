const reportService = require('../services/reportService');

class ReportController {
    async getDashboardStats(req, res, next) {
        try {
            const stats = await reportService.getGlobalStats();
            res.status(200).json({ success: true, data: stats });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ReportController();