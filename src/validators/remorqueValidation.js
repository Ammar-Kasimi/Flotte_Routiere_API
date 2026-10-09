const Joi = require('joi');

const remorqueSchemaValidation = Joi.object({
    immatriculation: Joi.string().required().messages({
        'any.required': 'L\'immatriculation est obligatoire',
        'string.empty': 'L\'immatriculation ne peut pas être vide'
    }),
    capacite: Joi.number().required().min(1).messages({
        'any.required': 'La capacité de la remorque est obligatoire',
        'number.min': 'La capacité doit être supérieure à 0'
    }),
    kilometrageCumule: Joi.number().min(0).default(0),
    kilometrageDerniereRevision: Joi.number().min(0).default(0),
    statut: Joi.string().valid('DISPONIBLE', 'EN_MAINTENANCE').default('DISPONIBLE')
});

module.exports = { remorqueSchemaValidation };