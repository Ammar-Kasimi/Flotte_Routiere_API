const Trajet = require('../models/Trajet');
const AlerteMaintenance = require('../models/AlerteMaintenance');

class ReportService {
    async getGlobalStats() {
        const trajetStats = await Trajet.aggregate([
            { $match: { statut: 'TERMINE' } },
            {
                $group: {
                    _id: null,
                    totalKilometrage: { $sum: { $subtract: ["$kilometrageArrivee", "$kilometrageDepart"] } },
                    totalGasoil: { $sum: "$volumeGasoil" },
                    totalCoutCarburant: { $sum: "$coutCarburant" }
                }
            }
        ]);

        const alertesNonTraitees = await AlerteMaintenance.countDocuments({ estTraitee: false });

        const stats = trajetStats[0] || { totalKilometrage: 0, totalGasoil: 0, totalCoutCarburant: 0 };
        
        const consommationMoyenne = stats.totalKilometrage > 0 
            ? (stats.totalGasoil / stats.totalKilometrage) * 100 
            : 0;

        return {
            kilometrageGlobal: stats.totalKilometrage,
            consommationGlobale: stats.totalGasoil,
            coutCarburantGlobal: stats.totalCoutCarburant,
            consommationMoyenne: consommationMoyenne,
            alertesMaintenanceActives: alertesNonTraitees
        };
    }
}

module.exports = new ReportService();