const express = require('express');
const router = express.Router();
const remorqueController = require('../controllers/RemorqueController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/roleMiddleware');
const { validate } = require('../middlewares/validateMiddleware');
const { remorqueSchemaValidation } = require('../validators/remorqueValidation');

router.use(verifyToken, isAdmin);

/**
 * @swagger
 * /api/remorques/{id}:
 *   get:
 *     summary: Récupérer une remorque par ID (Admin uniquement)
 *     tags: [Remorques]
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
 *         description: Détails de la remorque
 * 
 *   put:
 *     summary: Mettre à jour une remorque (Admin uniquement)
 *     tags: [Remorques]
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
 *               capacite: { type: number }
 *               statut: { type: string, enum: ['DISPONIBLE', 'EN_MAINTENANCE'] }
 *     responses:
 *       200:
 *         description: Remorque mise à jour
 */

/**
 * @swagger
 * /api/remorques/{id}/archive:
 *   patch:
 *     summary: Archiver (soft delete) une remorque (Admin uniquement)
 *     tags: [Remorques]
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
 *         description: Remorque archivée avec succès
 */

/**
 * @swagger
 * /api/remorques:
 *   post:
 *     summary: Ajoute une nouvelle remorque (Admin uniquement)
 *     tags: [Remorques]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               immatriculation: { type: string }
 *               capacite: { type: number }
 *     responses:
 *       201:
 *         description: Remorque créée
 *       409:
 *         description: Immatriculation déjà existante
 */
router.post('/', validate(remorqueSchemaValidation), remorqueController.create);

/**
 * @swagger
 * /api/remorques:
 *   get:
 *     summary: Liste toutes les remorques non archivées (Admin uniquement)
 *     tags: [Remorques]
 *     responses:
 *       200:
 *         description: Succès
 */
router.get('/', remorqueController.getAll);

router.get('/:id', remorqueController.getById);
router.put('/:id', validate(remorqueSchemaValidation), remorqueController.update);
router.patch('/:id/archive', remorqueController.archive);

module.exports = router;