const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/MaintenanceController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/roleMiddleware');
const { validate } = require('../middlewares/validateMiddleware');
const { regleValidation } = require('../validations/maintenanceValidation');

/**
 * @swagger
 * tags:
 *   name: Maintenance
 *   description: Gestion des règles et alertes de maintenance
 */

router.use(verifyToken, isAdmin);

/**
 * @swagger
 * /api/maintenance/regles:
 *   post:
 *     summary: Configurer une règle de maintenance (Admin uniquement)
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - typeOperation
 *               - periodiciteKm
 *             properties:
 *               typeOperation:
 *                 type: string
 *                 enum: [VIDANGE, REVISION, PNEUS]
 *               periodiciteKm:
 *                 type: number
 *     responses:
 *       200:
 *         description: Règle configurée avec succès
 */
router.post('/regles', validate(regleValidation), maintenanceController.configurerRegle);

/**
 * @swagger
 * /api/maintenance/regles:
 *   get:
 *     summary: Liste les règles de maintenance configurées (Admin uniquement)
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des règles récupérée avec succès
 */
router.get('/regles', maintenanceController.getRegles);

/**
 * @swagger
 * /api/maintenance/alertes:
 *   get:
 *     summary: Liste les alertes de maintenance (Admin uniquement)
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: estTraitee
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Liste des alertes récupérée avec succès
 */
router.get('/alertes', maintenanceController.getAlertes);

/**
 * @swagger
 * /api/maintenance/alertes/{id}/traiter:
 *   patch:
 *     summary: Marquer une alerte de maintenance comme traitée (Admin uniquement)
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Alerte traitée et compteurs du véhicule réinitialisés
 */
router.patch('/alertes/:id/traiter', maintenanceController.traiterAlerte);

module.exports = router;