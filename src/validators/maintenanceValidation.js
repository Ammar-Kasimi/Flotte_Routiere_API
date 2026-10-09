const Joi = require('joi');

const regleValidation = Joi.object({
    typeOperation: Joi.string().valid('VIDANGE', 'REVISION', 'PNEUS').required(),
    periodiciteKm: Joi.number().min(1).required()
});

module.exports = { regleValidation };