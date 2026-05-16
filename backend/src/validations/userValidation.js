const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
        'string.min': 'Name must be at least 2 characters',
        'string.max': 'Name must be at most 100 characters',
        'any.required': 'Name is required',
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required',
    }),
    password: Joi.string().min(8).max(100).required().messages({
        'string.min': 'Password must be at least 8 characters',
        'string.max': 'Password must be at most 100 characters',
        'any.required': 'Password is required',
    }),
});

const verifyEmailSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required',
    }),
    code: Joi.string().length(6).required().messages({
        'string.length': 'Verification code must be 6 characters',
        'any.required': 'Verification code is required',
    }),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required',
    }),
    password: Joi.string().required().messages({
        'any.required': 'Password is required',
    }),
});

const updatePasswordSchema = Joi.object({
    oldPassword: Joi.string().required().messages({
        'any.required': 'Old password is required',
    }),
    newPassword: Joi.string().min(8).max(100).required().messages({
        'string.min': 'New password must be at least 8 characters',
        'any.required': 'New password is required',
    }),
});

const updateNameSchema = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
        'string.min': 'Name must be at least 2 characters',
        'string.max': 'Name must be at most 100 characters',
        'any.required': 'Name is required',
    }),
});

module.exports = {
    registerSchema,
    verifyEmailSchema,
    loginSchema,
    updatePasswordSchema,
    updateNameSchema
};