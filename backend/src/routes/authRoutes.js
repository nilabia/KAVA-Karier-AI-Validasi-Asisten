const express = require('express');
const router = express.Router();
const AuthHandler = require('../handlers/AuthHandler');
const validate = require('../middleware/validationMiddleware');
const { loginSchema } = require('../validations/userValidation');

router.post('/login', validate(loginSchema), AuthHandler.login);
router.post('/google', AuthHandler.loginWithGoogle);
router.put('/refresh', AuthHandler.refreshToken);
router.delete('/logout', AuthHandler.logout);


module.exports = router;