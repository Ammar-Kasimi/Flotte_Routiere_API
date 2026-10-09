const mongoose = require('mongoose');

const utilisateurSchema = new mongoose.Schema({
  nom: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true
  },
  motDePasseHash: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['ADMIN', 'CHAUFFEUR'], 
    required: true 
  },
  statutCompte: { 
    type: String, 
    enum: ['ACTIF', 'SUSPENDU'], 
    default: 'ACTIF' 
  },
  refreshTokenHash: { 
    type: String, 
    default: null 
  }
}, { timestamps: true });

module.exports = mongoose.model('Utilisateur', utilisateurSchema);