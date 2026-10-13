const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://mongo:27017/flotte_db';
        await mongoose.connect(uri);
        console.log(' MongoDB connecté avec succès');
    } catch (error) {
        console.error(' Erreur de connexion MongoDB :', error);
        process.exit(1);
    }
};

module.exports = connectDB;