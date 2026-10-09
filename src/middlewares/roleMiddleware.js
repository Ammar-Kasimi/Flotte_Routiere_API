const isAdmin = (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ 
            success: false, 
            message: 'Accès interdit. Réservé aux administrateurs.' 
        });
    }
    next();
};

const isChauffeur = (req, res, next) => {
    if (req.user.role !== 'CHAUFFEUR') {
        return res.status(403).json({ 
            success: false, 
            message: 'Accès interdit. Réservé aux chauffeurs.' 
        });
    }
    next();
};

module.exports = { isAdmin, isChauffeur };