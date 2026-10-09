const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const utilisateurRepository = require('../repositories/UtilisateurRepository');

class AuthService {
    async login(email, password) {
        const user = await utilisateurRepository.findByEmail(email);

        if (!user) {
            const error = new Error('Identifiants incorrects');
            error.status = 401;
            throw error;
        }

        if (user.statutCompte === 'SUSPENDU') {
            const error = new Error('Ce compte est suspendu');
            error.status = 403;
            throw error;
        }
        
        const isMatch = await bcrypt.compare(password, user.motDePasseHash);
        if (!isMatch) {
            const error = new Error('Identifiants incorrects');
            error.status = 401;
            throw error;
        }

        const payload = { id: user._id, email: user.email, role: user.role };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        const tokenSalt = await bcrypt.genSalt(10);
        const hashedRefreshToken = await bcrypt.hash(refreshToken, tokenSalt);
        
        await utilisateurRepository.update(user._id, { refreshTokenHash: hashedRefreshToken });

        return { accessToken, refreshToken };
    }

    async logout(userId) {
        await utilisateurRepository.update(userId, { refreshTokenHash: null });
    }

    async refreshToken(tokenFourni) {
        if (!tokenFourni) {
            const error = new Error('Refresh token manquant');
            error.status = 401;
            throw error;
        }
        
        const decoded = jwt.verify(tokenFourni, process.env.JWT_SECRET);
        const user = await utilisateurRepository.findById(decoded.id);
        
        if (!user || user.statutCompte === 'SUSPENDU') {
            const error = new Error('Accès refusé ou compte suspendu');
            error.status = 403;
            throw error;
        }
        
        // FIXED: The guard is now correctly placed in the refresh flow
        if (!user.refreshTokenHash) {
            const error = new Error('Aucune session active. Veuillez vous reconnecter.');
            error.status = 401;
            throw error;
        }
        
        const isMatch = await bcrypt.compare(tokenFourni, user.refreshTokenHash);
        if (!isMatch) {
            const error = new Error('Refresh token invalide');
            error.status = 401;
            throw error;
        }
        
        const payload = { id: user._id, email: user.email, role: user.role };
        const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
        const newRefreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

        const tokenSalt = await bcrypt.genSalt(10);
        const hashedRefreshToken = await bcrypt.hash(newRefreshToken, tokenSalt);
        
        await utilisateurRepository.update(user._id, { refreshTokenHash: hashedRefreshToken });

        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }
}

module.exports = new AuthService();