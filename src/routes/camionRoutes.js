const express = require('express');
const router = express.Router();
const camionController = require('../controllers/CamionController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/roleMiddleware');
const { validate } = require('../middlewares/validateMiddleware');
const { camionSchemaValidation } = require('../validators/camionValidation');
router.use(verifyToken, isAdmin);


/**
 * @swagger
 * /api/camions/{id}:
 *   get:
 *     summary: Récupérer un camion par ID (Admin uniquement)
 *     tags: [Camions]
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
 *         description: Détails du camion
 * 
 *   put:
 *     summary: Mettre à jour un camion (Admin uniquement)
 *     tags: [Camions]
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
 *               immatriculation: { type: string }
 *               marque: { type: string }
 *               modele: { type: string }
 *               statut: { type: string, enum: ['DISPONIBLE', 'EN_MAINTENANCE'] }
 *     responses:
 *       200:
 *         description: Camion mis à jour
 */

/**
 * @swagger
 * /api/camions/{id}/archive:
 *   patch:
 *     summary: Archiver (soft delete) un camion (Admin uniquement)
 *     tags: [Camions]
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
 *         description: Camion archivé avec succès
 */

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