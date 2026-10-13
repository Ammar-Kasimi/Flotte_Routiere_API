require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Utilisateur = require('./src/models/Utilisateur');

async function createAdmin() {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://mongo:27017/flotte_db';
    await mongoose.connect(mongoURI);

    const salt = await bcrypt.genSalt(10);
    const motDePasseHash = await bcrypt.hash('password123', salt);

    await Utilisateur.deleteOne({ email: 'admin@test.com' });
    
    await Utilisateur.create({
      nom: 'Administrateur',
      email: 'admin@test.com',
      motDePasseHash: motDePasseHash,
      role: 'ADMIN',
      statutCompte: 'ACTIF'
    });

    console.log(' Compte Admin créé avec succès dans MongoDB !');
    console.log('Email: admin@test.com');
    console.log('Mot de passe: password123');
    process.exit(0);
  } catch (error) {
    console.error(' Erreur lors de la création de l\'admin :', error.message);
    process.exit(1);
  }
}

createAdmin();