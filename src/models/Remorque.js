const mongoose = require('mongoose');

const remorqueSchema = new mongoose.Schema({
    immatriculation: { type: String, required: true, unique: true },
    capacite: { type: Number, required: true },
    kilometrageCumule: { type: Number, default: 0 },
    kilometrageDerniereRevision: { type: Number, default: 0 },
    statut: { type: String, enum: ['DISPONIBLE', 'EN_MAINTENANCE'], default: 'DISPONIBLE' },
    estArchive: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Remorque', remorqueSchema);