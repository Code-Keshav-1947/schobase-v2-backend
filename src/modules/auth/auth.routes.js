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

// Temporary route for creating a school admin
// const createSchoolAdmin = async (req, res) => {
//   try {
//     const username = "schooladmin";
//     const password = "zxc mnbv";
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const schoolAdmin = await db.$transaction(async (prisma) => {
//       const user = await prisma.user.create({
//         data: {
//           username,
//           password: hashedPassword,
//           role: "SCHOOL_ADMIN",
//           email: "schooladmin@example.com",
//         },
//       });
//       const school_admin = await prisma.schoolAdmin.create({
//         data: {
//           userId: user.id,
//           schoolId: "1",
//         },
//       });
//       return user;
//     });

//     res.status(201).json(schoolAdmin);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// router.post("/school-admin", createSchoolAdmin);

module.exports = router;
