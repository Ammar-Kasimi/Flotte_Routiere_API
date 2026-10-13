const express = require('express');
const mongoose = require('mongoose');
const app = express();

const authRoutes = require('./routes/authRoutes');
const camionRoutes = require('./routes/camionRoutes');
const remorqueRoutes = require('./routes/remorqueRoutes');
const pneuRoutes = require('./routes/pneuRoutes');
const trajetRoutes = require('./routes/trajetRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

app.use(express.json());

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Gestion de Flotte',
            version: '1.0.0',
            description: 'API REST pour la gestion de camions, remorques et trajets.'
        },
        components: {
            securitySchemes: {
                bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: ['./src/routes/*.js'],
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(swaggerOptions)));

app.use('/api/auth', authRoutes);
app.use('/api/camions', camionRoutes);
app.use('/api/remorques', remorqueRoutes);
app.use('/api/pneus', pneuRoutes);
app.use('/api/trajets', trajetRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/reports', require('./routes/reportRoutes'));

app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({ success: false, message: err.message });
});

module.exports = app;