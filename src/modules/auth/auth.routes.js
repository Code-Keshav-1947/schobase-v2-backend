const router = require('express').Router();
const { register, login, refreshToken } = require('./auth.controller');
const { validate } = require('../../middlewares/validate');
const { registerSchema, loginSchema, refreshTokenSchema } = require('./auth.validation');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh-token', validate(refreshTokenSchema), refreshToken);