const mongoose = require('mongoose');

const camionSchema = new mongoose.Schema({
    immatriculation: { type: String, required: true, unique: true },
    marque: { type: String, required: true },
    modele: { type: String, required: true },
    kilometrageCumule: { type: Number, default: 0 },
    kilometrageDerniereVidange: { type: Number, default: 0 },
    kilometrageDerniereRevision: { type: Number, default: 0 },
    statut: { type: String, enum: ['DISPONIBLE', 'EN_MAINTENANCE'], default: 'DISPONIBLE' },
    estArchive: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Camion', camionSchema);