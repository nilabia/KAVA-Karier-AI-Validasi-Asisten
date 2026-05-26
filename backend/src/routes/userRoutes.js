const express = require('express');
const router = express.Router();
const UserHandler = require('../handlers/UserHandler');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const {
  registerSchema,
  verifyEmailSchema,
  updatePasswordSchema,
  updateNameSchema,
  setPasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  resendOtpSchema, 
} = require('../validations/userValidation');
const resendOtpSchema = Joi.object({
  email: Joi.string().email().required(),
});

router.post('/register', validate(registerSchema), UserHandler.register);
router.post('/verify', validate(verifyEmailSchema), UserHandler.verifyEmail);
router.get('/me', authMiddleware, UserHandler.getMe);
router.put('/password', authMiddleware, validate(updatePasswordSchema), UserHandler.updatePassword);
router.delete('/me', authMiddleware, UserHandler.deleteAccount);
router.put('/name', authMiddleware, validate(updateNameSchema), UserHandler.updateName);
router.put('/set-password', authMiddleware, validate(setPasswordSchema), UserHandler.setPassword);
router.post('/forgot-password', validate(forgotPasswordSchema), UserHandler.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), UserHandler.resetPassword);
router.post('/resend-otp', validate(resendOtpSchema), UserHandler.resendOtp);

module.exports = router;