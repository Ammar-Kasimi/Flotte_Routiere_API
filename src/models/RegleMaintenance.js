const mongoose = require('mongoose');

const regleMaintenanceSchema = new mongoose.Schema({
    typeOperation: {
        type: String,
        enum: ['VIDANGE', 'REVISION', 'PNEUS'],
        required: true,
        unique: true
    },
    periodiciteKm: {
        type: Number,
        required: true,
        min: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('RegleMaintenance', regleMaintenanceSchema);