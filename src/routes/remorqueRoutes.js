const express = require('express');
const router = express.Router();
const remorqueController = require('../controllers/RemorqueController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/roleMiddleware');
const { validate } = require('../middlewares/validateMiddleware');
const { remorqueSchemaValidation } = require('../validations/remorqueValidation');

router.use(verifyToken, isAdmin);

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