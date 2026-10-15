const express = require('express');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const logger = require('./config/logger');
const { authLimiter, standardLimiter, speedLimiter } = require('./middlewares/rateLimiter');

const app = express();

const authRoutes = require('./routes/authRoutes');
const camionRoutes = require('./routes/camionRoutes');
const remorqueRoutes = require('./routes/remorqueRoutes');
const pneuRoutes = require('./routes/pneuRoutes');
const trajetRoutes = require('./routes/trajetRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const reportRoutes = require('./routes/reportRoutes');

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

app.use(express.json());

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Fleet TrackPRO 2.0 API',
            version: '2.0.0',
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

app.use((req, res, next) => {
    req.id = uuidv4();
    res.setHeader('x-request-id', req.id);
    res.setHeader('X-API-Version', '2.0.0');
    res.setHeader('X-API-Deprecated', 'false');
    
    logger.info({
        message: 'Incoming Request',
        requestId: req.id,
        method: req.method,
        url: req.url,
        ip: req.ip
    });
    
    next();
});


app.use(speedLimiter);
app.use(standardLimiter);

app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/camions', camionRoutes);
app.use('/api/v1/remorques', remorqueRoutes);
app.use('/api/v1/pneus', pneuRoutes);
app.use('/api/v1/trajets', trajetRoutes);
app.use('/api/v1/maintenance', maintenanceRoutes);
app.use('/api/v1/reports', reportRoutes);

app.use((err, req, res, next) => {
    const status = err.status || 500;
    
    logger.error({
        message: err.message,
        requestId: req.id,
        status: status,
        stack: err.stack
    });
    
    res.status(status).json({ success: false, message: err.message });
});

module.exports = app;