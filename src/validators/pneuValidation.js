const Joi = require('joi');

const pneuSchemaValidation = Joi.object({
    position: Joi.string().valid(
        'AVANT_GAUCHE', 'AVANT_DROIT', 
        'ARRIERE_GAUCHE', 'ARRIERE_DROIT', 
        'SECOURS'
    ).required().messages({
        'any.required': 'La position du pneu est obligatoire',
        'any.only': 'Position invalide'
    }),
    kilometrageActuel: Joi.number().min(0).default(0),
    etat: Joi.string().valid('NEUF', 'USE', 'A_REMPLACER').default('NEUF'),
    camion: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
        'any.required': 'L\'identifiant du camion est obligatoire',
        'string.pattern.base': 'Identifiant de camion invalide'
    })
});

module.exports = { pneuSchemaValidation };