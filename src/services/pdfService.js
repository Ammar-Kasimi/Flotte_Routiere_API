const PDFDocument = require('pdfkit');

class PdfService {
    genererOrdreMission(trajet, res) {
        const doc = new PDFDocument({ margin: 50 });
        
        doc.pipe(res);

        doc.fontSize(22).text('Ordre de Mission', { align: 'center' });
        doc.moveDown();

        doc.fontSize(14).text(`Trajet ID : ${trajet._id}`);
        doc.text(`Statut : ${trajet.statut}`);
        doc.text(`Date de départ prévue : ${trajet.dateDebutPrevue ? trajet.dateDebutPrevue.toLocaleDateString() : 'N/A'}`);
        doc.text(`Date d'arrivée prévue : ${trajet.dateFinPrevue ? trajet.dateFinPrevue.toLocaleDateString() : 'N/A'}`);
        doc.text(`Site de départ : ${trajet.siteDepart}`);
        doc.text(`Site d'arrivée : ${trajet.siteArrivee}`);
        doc.text(`Marchandise : ${trajet.marchandise}`);
        doc.moveDown();

        doc.fontSize(16).text('--- Chauffeur ---');
        doc.fontSize(14);
        if (trajet.chauffeur) {
            doc.text(`Nom : ${trajet.chauffeur.nom}`);
            doc.text(`Email : ${trajet.chauffeur.email}`);
        } else {
            doc.text('Non assigné');
        }
        doc.moveDown();

        doc.fontSize(16).text('--- Véhicules ---');
        doc.fontSize(14);
        if (trajet.camion) {
            doc.text(`Camion : ${trajet.camion.immatriculation} (${trajet.camion.marque} ${trajet.camion.modele})`);
        } else {
            doc.text('Camion : Non assigné');
        }
        
        if (trajet.remorque) {
            doc.text(`Remorque : ${trajet.remorque.immatriculation} (Capacité: ${trajet.remorque.capacite}T)`);
        } else {
            doc.text('Remorque : Non assignée');
        }

        doc.end();
    }
}

module.exports = new PdfService();