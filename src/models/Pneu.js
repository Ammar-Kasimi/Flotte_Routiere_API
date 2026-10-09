const mongoose = require('mongoose');

const pneuSchema = new mongoose.Schema({
    position: { 
        type: String, 
        required: true
        ,enum: ['AVANT_GAUCHE', 'AVANT_DROIT', 'ARRIERE_GAUCHE', 'ARRIERE_DROIT', 'SECOURS'] 
    },
    kilometrageActuel: { 
        type: Number, 
        default: 0 
    },
    etat: { 
        type: String, 
        enum: ['NEUF', 'USE', 'A_REMPLACER'], 
        default: 'NEUF' 
    },
    camion: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Camion',
        required: true
    }
}, { timestamps: true });

pneuSchema.index({ camion: 1, position: 1 }, { unique: true });
module.exports = mongoose.model('Pneu', pneuSchema);