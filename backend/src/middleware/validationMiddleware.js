const ClientError = require('../exceptions/ClientError');

const validate = (schema) => (req, res, next) => {
    Object.keys(req.body).forEach((key) => {
        if (typeof req.body[key] === 'string') {
            req.body[key] = xss(req.body[key]);
        }
    });
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const message = error.details.map((d) => d.message).join(', ');
        return next(new ClientError(message, 400));
    }

    next();
};

module.exports = validate;