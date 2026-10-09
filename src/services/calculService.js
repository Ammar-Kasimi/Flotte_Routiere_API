class CalculService {
    calculerDistance(kilometrageDepart, kilometrageArrivee) {
        if (kilometrageArrivee <= kilometrageDepart) {
            const error = new Error('Le kilométrage d\'arrivée doit être supérieur au départ');
            error.status = 400;
            throw error;
        }
        return kilometrageArrivee - kilometrageDepart;
    }
    calculerConsommationMoyenne(distance, volumeGasoil) {
        if (distance <= 0) return 0;
        return parseFloat(((volumeGasoil / distance) * 100).toFixed(2));
    }
}

module.exports = new CalculService();   