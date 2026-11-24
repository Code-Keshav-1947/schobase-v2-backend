const router = require("express").Router();
const controller = require("./teacher.controller");
const validation = require("./teacher.validation");
const { validate } = require("../../middlewares/validate");
const { authenticate } = require("../../middlewares/auth");

router.use(authenticate);

router.get("/", controller.getAllTeachers);
router.post(
  "/",
  validate(validation.createTeacherSchema),
  controller.createTeacher
);
router.get("/:id", controller.getTeacherById);
module.exports = router;
