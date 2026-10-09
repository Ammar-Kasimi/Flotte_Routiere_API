const jwt = require('jsonwebtoken');
const Utilisateur = require('../models/Utilisateur');

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Accès refusé. Token manquant.' });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await Utilisateur.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Utilisateur introuvable.' });
        }

        if (user.statutCompte === 'SUSPENDU') {
            return res.status(403).json({ success: false, message: 'Ce compte est suspendu.' });
        }

        req.user = { id: user._id, email: user.email, role: user.role };
        
        next(); 
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Token invalide ou expiré.' });
    }
};

module.exports = { verifyToken };