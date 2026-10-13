const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * /api/reports/dashboard:
 *   get:
 *     summary: Obtenir les statistiques globales de la flotte (Admin uniquement)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques récupérées avec succès
 */
router.get('/dashboard', verifyToken, isAdmin, reportController.getDashboardStats);

module.exports = router;