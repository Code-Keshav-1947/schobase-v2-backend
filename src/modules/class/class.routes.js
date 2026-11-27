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
  roleBasedAccess(["admin", "school_admin"]),
  classController.getClassById
);
router.post(
  "/",
  roleBasedAccess(["admin", "school_admin"]),
  validate(classSchema.createClassSchema),
  classController.createClass
);
router.put(
  "/:id",
  roleBasedAccess(["admin", "school_admin"]),
  validate(classSchema.updateClassSchema),
  classController.updateClass
);
router.delete(
  "/:id",
  roleBasedAccess(["admin", "school_admin"]),
  classController.deleteClass
);
router.get(
  "/school/:schoolId",
  roleBasedAccess(["admin", "school_admin"]),
  classController.getAllClassesForSchool
);
router.get(
  "/teacher/:teacherId",
  roleBasedAccess(["admin", "school_admin"]),
  classController.getAllClassesForTeacher
);

module.exports = router;
