const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const { verifyToken } = require('../middlewares/authMiddleware');

const { isAdmin } = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * /api/auth/chauffeurs:
 *   post:
 *     summary: Créer un compte chauffeur (Admin uniquement)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom: { type: string }
 *               email: { type: string }
 *               motDePasse: { type: string }
 *     responses:
 *       201:
 *         description: Chauffeur créé avec succès
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Déconnecter l'utilisateur courant
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 */

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Rafraîchir le token d'accès
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200:
 *         description: Nouveaux tokens générés
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connecte un utilisateur (Admin ou Chauffeur)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Tokens générés avec succès
 *       401:
 *         description: Identifiants incorrects
 */

/**
 * @swagger
 * /api/auth/chauffeurs/{id}/suspendre:
 *   patch:
 *     summary: Suspendre le compte d'un chauffeur (Admin)
 *     tags: [Auth]
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
 *         description: Compte suspendu
 */
router.patch('/chauffeurs/:id/suspendre', verifyToken, isAdmin, authController.suspendre);

/**
 * @swagger
 * /api/auth/chauffeurs/{id}/reactiver:
 *   patch:
 *     summary: Réactiver le compte d'un chauffeur (Admin)
 *     tags: [Auth]
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
 *         description: Compte réactivé
 */
router.patch('/chauffeurs/:id/reactiver', verifyToken, isAdmin, authController.reactiver);



router.post('/chauffeurs', verifyToken, isAdmin, authController.registerTest);

router.post('/login', authController.login);
router.post('/logout', verifyToken, authController.logout);
router.post('/refresh', authController.refresh);

module.exports = router;