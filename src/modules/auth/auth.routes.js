const router = require('express').Router();
const {  login, refreshToken } = require('./auth.controller');
const { validate } = require('../../middlewares/validate');
const {  loginSchema, refreshTokenSchema } = require('./auth.validation');

router.post('/login', validate(loginSchema), login);
router.post('/refresh-token', validate(refreshTokenSchema), refreshToken);

module.exports = router;
