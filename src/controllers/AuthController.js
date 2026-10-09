const authService = require('../services/authService');
const utilisateurService = require('../services/utilisateurService');

class AuthController {
    async registerTest(req, res, next) {
        try {
            const newUser = await utilisateurService.createChauffeur(req.body);
            res.status(201).json({
                success: true,
                message: 'Chauffeur créé avec succès',
                data: {
                    id: newUser._id,
                    email: newUser.email,
                    role: newUser.role
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const tokens = await authService.login(email, password);

            res.status(200).json({
                success: true,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken
            });
        } catch (error) {
            next(error);
        }
    }

    async logout(req, res, next) {
        try {
            const userId = req.user.id;
            await authService.logout(userId);

            res.status(200).json({
                success: true,
                message: 'Déconnexion réussie'
            });
        } catch (error) {
            next(error);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.body;
            const tokens = await authService.refreshToken(refreshToken);

            res.status(200).json({
                success: true,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken
            });
        } catch (error) {
            next(error);
        }
    }
    async suspendre(req, res, next) {
        try {
            const user = await utilisateurService.suspendreCompte(req.params.id);
            res.status(200).json({ success: true, message: 'Compte suspendu avec succès', data: user });
        } catch (error) {
            next(error);
        }
    }

    async reactiver(req, res, next) {
        try {
            const user = await utilisateurService.reactiverCompte(req.params.id);
            res.status(200).json({ success: true, message: 'Compte réactivé avec succès', data: user });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();