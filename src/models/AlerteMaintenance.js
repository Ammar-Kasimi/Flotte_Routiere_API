const mongoose = require('mongoose');

const alerteMaintenanceSchema = new mongoose.Schema({
    vehiculeId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'typeVehicule' },
    typeVehicule: { type: String, enum: ['Camion', 'Remorque'], required: true },
    typeOperation: { type: String, enum: ['VIDANGE', 'REVISION', 'PNEUS'], required: true },
    kilometrageAuDeclenchement: { type: Number, required: true },
    estTraitee: { type: Boolean, default: false },
    pneu: { type: mongoose.Schema.Types.ObjectId, ref: 'Pneu' }
}, { timestamps: true });

module.exports = mongoose.model('AlerteMaintenance', alerteMaintenanceSchema);