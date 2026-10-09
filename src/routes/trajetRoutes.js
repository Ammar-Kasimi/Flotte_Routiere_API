const express = require('express');
const router = express.Router();
const TrajetController = require('../controllers/TrajetController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { isAdmin, isChauffeur } = require('../middlewares/roleMiddleware');
const { validate } = require('../middlewares/validateMiddleware');
const { 
    trajetCreationValidation, 
    trajetUpdateValidation, 
    trajetFinValidation,
    statutValidation 
} = require('../validations/trajetValidation');

/**
 * @swagger
 * tags:
 *   name: Trajets
 *   description: Gestion et suivi des trajets
 */

/**
 * @swagger
 * /api/trajets/mes-trajets:
 *   get:
 *     summary: Récupère la liste des trajets assignés au chauffeur connecté (Chauffeur uniquement)
 *     tags: [Trajets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des trajets récupérée avec succès
 *       403:
 *         description: Accès interdit
 */
router.get('/mes-trajets', verifyToken, isChauffeur, TrajetController.getMesTrajets);

/**
 * @swagger
 * /api/trajets/{id}/saisie:
 *   patch:
 *     summary: Saisie du kilométrage, carburant et remarques (Chauffeur uniquement)
 *     tags: [Trajets]
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
 *               kilometrageDepart: { type: number }
 *               kilometrageArrivee: { type: number }
 *               volumeGasoil: { type: number }
 *               coutCarburant: { type: number }
 *               remarqueChauffeur: { type: string }
 *     responses:
 *       200:
 *         description: Données enregistrées avec succès
 */
router.patch('/:id/saisie', verifyToken, isChauffeur, validate(trajetFinValidation), TrajetController.saisirDonneesFin);

/**
 * @swagger
 * /api/trajets/{id}/statut:
 *   patch:
 *     summary: Met à jour le statut du trajet (Chauffeur uniquement)
 *     tags: [Trajets]
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
 *             required: [statut]
 *             properties:
 *               statut: { type: string, enum: ['A_FAIRE', 'EN_COURS', 'TERMINE'] }
 *     responses:
 *       200:
 *         description: Statut mis à jour avec succès
 *       400:
 *         description: Transition de statut invalide ou ordre non respecté
 */
router.patch('/:id/statut', verifyToken, isChauffeur, validate(statutValidation), TrajetController.updateStatutChauffeur);

/**
 * @swagger
 * /api/trajets/{id}/pdf:
 *   get:
 *     summary: Télécharge l'ordre de mission en PDF (Chauffeur et Admin)
 *     tags: [Trajets]
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
 *         description: Fichier PDF généré avec succès
 *       403:
 *         description: Accès interdit (Trajet d'un autre chauffeur)
 *       404:
 *         description: Trajet introuvable
 */
router.get('/:id/pdf', verifyToken, TrajetController.downloadPDF);

/**
 * @swagger
 * /api/trajets:
 *   post:
 *     summary: Créer et planifier un nouveau trajet (Admin uniquement)
 *     tags: [Trajets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               siteDepart: { type: string }
 *               siteArrivee: { type: string }
 *               marchandise: { type: string }
 *               dateDebutPrevue: { type: string, format: date-time }
 *               dateFinPrevue: { type: string, format: date-time }
 *               chauffeur: { type: string }
 *               camion: { type: string }
 *               remorque: { type: string }
 *     responses:
 *       201:
 *         description: Trajet créé avec succès
 *       409:
 *         description: Conflit d'assignation
 */
router.post('/', verifyToken, isAdmin, validate(trajetCreationValidation), TrajetController.create);

/**
 * @swagger
 * /api/trajets:
 *   get:
 *     summary: Liste tous les trajets (Admin uniquement)
 *     tags: [Trajets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de tous les trajets
 */
router.get('/', verifyToken, isAdmin, TrajetController.getAll);

/**
 * @swagger
 * /api/trajets/{id}:
 *   get:
 *     summary: Récupère les détails d'un trajet par son ID (Admin uniquement)
 *     tags: [Trajets]
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
 *         description: Détails du trajet
 */
router.get('/:id', verifyToken, isAdmin, TrajetController.getById);

/**
 * @swagger
 * /api/trajets/{id}:
 *   put:
 *     summary: Met à jour les informations d'un trajet (Admin uniquement)
 *     tags: [Trajets]
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
 *     responses:
 *       200:
 *         description: Trajet mis à jour
 */
router.put('/:id', verifyToken, isAdmin, validate(trajetUpdateValidation), TrajetController.update);

/**
 * @swagger
 * /api/trajets/{id}/admin-statut:
 *   patch:
 *     summary: Force la correction du statut d'un trajet (Admin uniquement)
 *     tags: [Trajets]
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
 *             required: [statut]
 *             properties:
 *               statut: { type: string, enum: ['A_FAIRE', 'EN_COURS', 'TERMINE'] }
 *     responses:
 *       200:
 *         description: Statut forcé avec succès
 */
router.patch('/:id/admin-statut', verifyToken, isAdmin, validate(statutValidation), TrajetController.updateStatutAdmin);

module.exports = router;