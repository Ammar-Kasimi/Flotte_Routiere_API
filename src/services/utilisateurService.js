const bcrypt = require('bcrypt');
const utilisateurRepository = require('../repositories/UtilisateurRepository');
class UtilisateurService {
    async createChauffeur(donnees) {

        const existingUser = await utilisateurRepository.findByEmail(donnees.email);
        if (existingUser) {
            const error = new Error('Cet email est déjà utilisé');
            error.status = 409;
            throw error;
        }

        const salt = await bcrypt.genSalt(10);
        const motDePasseHash = await bcrypt.hash(donnees.motDePasse, salt);

        return await utilisateurRepository.create({
            nom: donnees.nom,
            email: donnees.email,
            role: 'CHAUFFEUR',
            motDePasseHash: motDePasseHash
        });
    }

    async suspendreCompte(userId) {
        return await utilisateurRepository.update(userId, { statutCompte: 'SUSPENDU' });
    }
    async reactiverCompte(userId) {
    return await utilisateurRepository.update(userId, { statutCompte: 'ACTIF' });
}
}

module.exports = new UtilisateurService();