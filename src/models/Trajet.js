const mongoose = require('mongoose');

const trajetSchema = new mongoose.Schema({
    siteDepart: { type: String, required: true },
    siteArrivee: { type: String, required: true },
    marchandise: { type: String, required: true },
    
    dateDebutPrevue: { type: Date, required: true },
    dateFinPrevue: { type: Date, required: true },
    dateDebutReelle: { type: Date },
    dateFinReelle: { type: Date },
    
    statut: { 
        type: String, 
        enum: ['A_FAIRE', 'EN_COURS', 'TERMINE'], 
        default: 'A_FAIRE' 
    },

    chauffeur: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' },
    camion: { type: mongoose.Schema.Types.ObjectId, ref: 'Camion' },
    remorque: { type: mongoose.Schema.Types.ObjectId, ref: 'Remorque' },

    kilometrageDepart: { type: Number ,min:0},
    kilometrageArrivee: { type: Number,min:0 },
    volumeGasoil: { type: Number, min: 0 }, 
    coutCarburant: { type: Number, min: 0 },
    remarqueChauffeur: { type: String }
    ,consommationMoyenne: { type: Number },
}, { timestamps: true });

trajetSchema.index({ camion: 1, dateDebutPrevue: 1, dateFinPrevue: 1 });
trajetSchema.index({ remorque: 1, dateDebutPrevue: 1, dateFinPrevue: 1 });
trajetSchema.index({ chauffeur: 1, dateDebutPrevue: 1, dateFinPrevue: 1 });

module.exports = mongoose.model('Trajet', trajetSchema);

