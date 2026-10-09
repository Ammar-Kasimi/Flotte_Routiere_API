const express = require('express');
const router = express.Router();
const pneuController = require('../controllers/PneuController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/roleMiddleware');
const { validate } = require('../middlewares/validateMiddleware');
const { pneuSchemaValidation } = require('../validations/pneuValidation');

router.use(verifyToken, isAdmin);


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