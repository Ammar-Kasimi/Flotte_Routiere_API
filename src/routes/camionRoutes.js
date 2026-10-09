const express = require('express');
const router = express.Router();
const camionController = require('../controllers/CamionController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/roleMiddleware');
const { validate } = require('../middlewares/validateMiddleware');
const { camionSchemaValidation } = require('../validations/camionValidation');
router.use(verifyToken, isAdmin);

/**
 * @swagger
 * /api/camions:
 *   post:
 *     summary: Ajoute un nouveau camion (Admin uniquement)
 *     tags: [Camions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               immatriculation: { type: string }
 *               marque: { type: string }
 *               modele: { type: string }
 *     responses:
 *       201:
 *         description: Camion créé
 *       409:
 *         description: Immatriculation déjà existante
 */

/**
 * @swagger
 * /api/camions:
 *   get:
 *     summary: Liste tous les camions non archivés (Admin uniquement)
 *     tags: [Camions]
 *     responses:
 *       200:
 *         description: Succès
 * 
 */
router.post('/', validate(camionSchemaValidation), camionController.create);
router.get('/', camionController.getAll);
router.get('/:id', camionController.getById);
router.put('/:id', validate(camionSchemaValidation), camionController.update);
router.patch('/:id/archive', camionController.archive);

module.exports = router;