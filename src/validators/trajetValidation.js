const Joi = require('joi');

const trajetCreationValidation = Joi.object({
    siteDepart: Joi.string().required().messages({ 'any.required': 'Le site de départ est obligatoire' }),
    siteArrivee: Joi.string().required().messages({ 'any.required': 'Le site d\'arrivée est obligatoire' }),
    marchandise: Joi.string().required().messages({ 'any.required': 'La marchandise est obligatoire' }),
    dateDebutPrevue: Joi.date().iso().required().messages({ 'any.required': 'La date de début prévue est obligatoire' }),
    dateFinPrevue: Joi.date().iso().greater(Joi.ref('dateDebutPrevue')).required().messages({ 'date.greater': 'La date de fin doit être postérieure à la date de début' }),
    chauffeur: Joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).optional(),
    camion: Joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).optional(),
    remorque: Joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).optional()
});

const trajetUpdateValidation = Joi.object({
    siteDepart: Joi.string().optional(),
    siteArrivee: Joi.string().optional(),
    marchandise: Joi.string().optional(),
    dateDebutPrevue: Joi.date().iso().optional(),
    dateFinPrevue: Joi.date().iso().optional(),
    chauffeur: Joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).optional(),
    camion: Joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).optional(),
    remorque: Joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).optional()
}).min(1);

const trajetFinValidation = Joi.object({
    kilometrageDepart: Joi.number().min(0).required().messages({ 'any.required': 'Le kilométrage de départ est obligatoire' }),
    kilometrageArrivee: Joi.number().greater(Joi.ref('kilometrageDepart')).required().messages({
        'number.greater': 'Le kilométrage d\'arrivée doit être strictement supérieur au kilométrage de départ',
        'any.required': 'Le kilométrage d\'arrivée est obligatoire'
    }),
    volumeGasoil: Joi.number().min(0).required().messages({ 'any.required': 'Le volume de gasoil est obligatoire' }),
    coutCarburant: Joi.number().min(0).required().messages({ 'any.required': 'Le coût du carburant est obligatoire' }),
    remarqueChauffeur: Joi.string().allow('', null).optional()
});

const statutValidation = Joi.object({
    statut: Joi.string().valid('A_FAIRE', 'EN_COURS', 'TERMINE').required()
});

module.exports = { 
    trajetCreationValidation, 
    trajetUpdateValidation, 
    trajetFinValidation,
    statutValidation
};