const express = require('express');
const router = express.Router();
const pneuController = require('../controllers/PneuController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/roleMiddleware');
const { validate } = require('../middlewares/validateMiddleware');
const { pneuSchemaValidation } = require('../validators/pneuValidation');

router.use(verifyToken, isAdmin);

/**
 * @swagger
 * /api/pneus/camion/{camionId}:
 *   get:
 *     summary: Lister tous les pneus d'un camion spécifique (Admin uniquement)
 *     tags: [Pneus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: camionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des pneus récupérée
 */

/**
 * @swagger
 * /api/pneus/{id}:
 *   put:
 *     summary: Mettre à jour l'état ou le kilométrage d'un pneu (Admin uniquement)
 *     tags: [Pneus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               position: { type: string }
 *               kilometrageActuel: { type: number }
 *               etat: { type: string, enum: ['NEUF', 'USE', 'A_REMPLACER'] }
 *     responses:
 *       200:
 *         description: Pneu mis à jour
 */

/**
 * @swagger
 * /api/pneus:
 *   post:
 *     summary: Ajoute un nouveau pneu (Admin uniquement)
 *     tags: [Pneus]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               position: { type: string, enum: ['AVANT_GAUCHE', 'AVANT_DROIT', 'ARRIERE_GAUCHE', 'ARRIERE_DROIT', 'SECOURS'] }
 *               camion: { type: string, description: "ID du camion" }
 *     responses:
 *       201:
 *         description: Pneu créé
 */

router.post('/', validate(pneuSchemaValidation), pneuController.create);
router.get('/camion/:camionId', pneuController.getByCamion);
router.put('/:id', validate(pneuSchemaValidation), pneuController.update);

module.exports = router;