const express = require('express');
const router = express.Router();
const UserHandler = require('../handlers/UserHandler');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', UserHandler.register);
router.post('/verify', UserHandler.verifyEmail);
router.get('/me', authMiddleware, UserHandler.getMe);
router.put('/password', authMiddleware, UserHandler.updatePassword);
router.delete('/me', authMiddleware, UserHandler.deleteAccount);

module.exports = router;