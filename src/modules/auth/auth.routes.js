const router = require("express").Router();
const { login, refreshToken, logout, getMe } = require("./auth.controller");
const { validate } = require("../../middlewares/validate");
const { loginSchema, refreshTokenSchema } = require("./auth.validation");
const { authenticate } = require("../../middlewares/auth");
const db = require("../prisma/db");
const bcrypt = require("bcryptjs");

router.post("/login", validate(loginSchema), login);
router.post("/refresh-token", validate(refreshTokenSchema), refreshToken);
router.post("/logout", logout);
router.get("/me", authenticate, getMe);

module.exports = router;
