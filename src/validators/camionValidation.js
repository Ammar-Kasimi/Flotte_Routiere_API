const Joi = require('joi')

const camionSchemaValidation = 
Joi.object({
    immatriculation:Joi.string().required().messages({

        'any.required':'L\'immatriculation est obligatoire',
        'string.empty': 'L\'immatriculation ne peut pas etre vide'
    }),
    marque: Joi.string().required(),
    modele: Joi.string().required(),
    kilometrageCumule: Joi.number().min(0).default(0),
    kilometrageDerniereVidange: Joi.number().min(0).default(0),
    kilometrageDerniereRevision: Joi.number().min(0).default(0),
    statut: Joi.string().valid('DISPONIBLE', 'EN_MAINTENANCE').default('DISPONIBLE')
});

module.exports = { camionSchemaValidation };
