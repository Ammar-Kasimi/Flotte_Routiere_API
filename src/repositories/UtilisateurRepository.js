const Utilisateur = require('../models/Utilisateur');

class UtilisateurRepository {

 
    async findByEmail(email) {
        return await Utilisateur.findOne({ email });
    }

    async findById(id) {
        return await Utilisateur.findById(id);
    }
  
   
    async create(donnees) {
        const nouvelUtilisateur = new Utilisateur(donnees);
        return await nouvelUtilisateur.save();
    }

    async update(id, donneesMiseAJour) {
        return await Utilisateur.findByIdAndUpdate(id, donneesMiseAJour, { new: true });
    }

    
}

module.exports = new UtilisateurRepository();