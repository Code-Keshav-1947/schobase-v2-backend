const router = require("express").Router();
const classController = require("./class.controller");
const { authenticate } = require("../../middlewares/auth");
const roleBasedAccess = require("../../middlewares/roleBasedAccess");
const classSchema = require("./class.validation");
const { validate } = require("../../middlewares/validate");

router.use(authenticate);

router.get("/", roleBasedAccess(["admin"]), classController.getAllClasses);
router.get(
  "/:id",
  roleBasedAccess(["admin", "schoolAdmin"]),
  classController.getClassById
);
router.post(
  "/",
  roleBasedAccess(["admin", "schoolAdmin"]),
  validate(classSchema.createClassSchema),
  classController.createClass
);
router.put(
  "/:id",
  roleBasedAccess(["admin", "schoolAdmin"]),
  validate(classSchema.updateClassSchema),
  classController.updateClass
);
router.delete(
  "/:id",
  roleBasedAccess(["admin", "schoolAdmin"]),
  classController.deleteClass
);
router.get(
  "/school/:schoolId",
  roleBasedAccess(["admin", "schoolAdmin"]),
  classController.getAllClassesForSchool
);
router.get(
  "/teacher/:teacherId",
  roleBasedAccess(["admin", "schoolAdmin"]),
  classController.getAllClassesForTeacher
);

module.exports = router;
