const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const messages = error.details.map(detail => detail.message).join(', ');
            const customError = new Error(messages);
            customError.status = 400;
            return next(customError);
            }
        next();
    };
};

module.exports = { validate };