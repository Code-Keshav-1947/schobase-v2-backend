const router = require("express").Router();
const auth = require("../../middlewares/auth");
const roleBasedAccess = require("../../middlewares/roleBasedAccess");
const { validate } = require("../../middlewares/validate");
const controller = require("./school.controller");
const validation = require("./school.validation");

router.use(auth.authenticate);

router.get("/", roleBasedAccess(["ADMIN"]), controller.getAllSchools);
router.post(
  "/",
  roleBasedAccess(["ADMIN"]),
  validate(validation.createSchoolSchema),
  controller.createSchool
);
router.patch(
  "/:id",
  roleBasedAccess(["ADMIN"]),
  validate(validation.updateSchoolSchema),
  controller.updateSchool
);

router.delete(
  "/:id",
  roleBasedAccess(["ADMIN"]),
  validate(validation.deleteSchoolSchema),
  controller.deleteSchool
);

router.get(
  "/:id",
  roleBasedAccess(["ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT"]),
  controller.getSchoolById
);

module.exports = router;
