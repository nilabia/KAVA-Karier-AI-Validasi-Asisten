const express = require('express');
const router = express.Router();
const AuthHandler = require('../handlers/AuthHandler');

router.post('/login', AuthHandler.login);
router.post('/google', AuthHandler.loginWithGoogle);
router.put('/refresh', AuthHandler.refreshToken);
router.delete('/logout', AuthHandler.logout);


module.exports = router;