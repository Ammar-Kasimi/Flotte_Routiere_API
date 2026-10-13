const request = require('supertest');
const app = require('../src/app'); 
require('./setup'); 

describe('Test des routes Auth', () => {
    it('devrait retourner 401 si les identifiants sont incorrects', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'nexiste.pas@test.com',
                password: 'wrongpassword'
            });

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Identifiants incorrects');
    });
});