const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();
require('./setup');

const testCamion = {
    immatriculation: 'AB-123-CD',
    marque: 'Volvo',
    modele: 'FH16',
    annee: 2022,
    kilometrage: 50000,
    statut: 'DISPONIBLE',
    type: 'TRACTEUR',
    capacite: 20
};

let adminToken;
let camionId;

describe('Test des routes Camion (CRUD)', () => {
    
    beforeAll(async () => {
        const User = mongoose.model('Utilisateur');
        
        const adminUser = new User({
            nom: 'Admin Test',
            email: 'admin@test.com',
            motDePasseHash: 'hash_fictif',
            role: 'ADMIN'
        });
        await adminUser.save();

        const secret = process.env.JWT_SECRET || 'secret';

        adminToken = jwt.sign(
            { 
                id: adminUser._id.toString(), 
                userId: adminUser._id.toString(), 
                role: adminUser.role 
            },
            secret,
            { expiresIn: '1h' }
        );
    });

    it('1. Devrait créer un nouveau camion', async () => {
        const response = await request(app)
            .post('/api/camions')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(testCamion);

        if (response.status !== 201) {
            throw new Error("ERREUR CREATION: " + JSON.stringify(response.body));
        }

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.immatriculation).toBe(testCamion.immatriculation);
        
        camionId = response.body.data._id;
    });

    it('2. Devrait récupérer la liste des camions', async () => {
        const response = await request(app)
            .get('/api/camions')
            .set('Authorization', `Bearer ${adminToken}`);

        if (response.status !== 200) {
            throw new Error("ERREUR GET: " + JSON.stringify(response.body));
        }

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('3. Devrait mettre à jour le kilométrage du camion', async () => {
        const response = await request(app)
            .put(`/api/camions/${camionId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ kilometrage: 60000 });

        if (response.status !== 200) {
            throw new Error("ERREUR PUT: " + JSON.stringify(response.body));
        }

        expect(response.status).toBe(200);
        expect(response.body.data.kilometrage).toBe(60000);
    });

    it('4. Devrait archiver (soft delete) le camion', async () => {
        const response = await request(app)
            .delete(`/api/camions/${camionId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        if (response.status !== 200) {
            throw new Error("ERREUR DELETE: " + JSON.stringify(response.body));
        }

        expect(response.status).toBe(200);
        
        const verifResponse = await request(app)
            .get(`/api/camions/${camionId}`)
            .set('Authorization', `Bearer ${adminToken}`);
            
        expect(verifResponse.body.data.isArchived).toBe(true);
    });
});