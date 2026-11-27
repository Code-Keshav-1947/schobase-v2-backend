const services = require("./class.service");
const compareRoles = require("../../utils/compareRoles");

const createClass = async (req, res) => {
  try {
    console.log("user:", req.user);
    const { role } = req.user;
    if (!compareRoles(role, "school_admin") && !compareRoles(role, "admin")) {
      return res
        .status(403)
        .json({ error: "Only school admins and admins can create classes" });
    }
    if (compareRoles(role, "admin")) {
      const { name, schoolId } = req.body;
      const newClass = await services.createClass({ name, schoolId });
      res.status(201).json(newClass);
    }
    if (compareRoles(role, "school_admin")) {
      const { name } = req.body;
      const { schoolId } = req.user;
      if (schoolId !== req.body.schoolId) {
        console.log("Current School ID:", schoolId);
        console.log("Requested School ID:", req.body.schoolId);
        return res
          .status(403)
          .json({ error: "You can only create classes for your own school" });
      }
      const newClass = await services.createClass({
        name,
        schoolId: schoolId,
      });
      res.status(201).json(newClass);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllClasses = async (req, res) => {
  try {
    const { page, take, search } = req.query;
    const classes = await services.getAllClasses(
      search,
      parseInt(take),
      parseInt(page)
    );
    res.status(200).json(classes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getClassById = async (req, res) => {
  try {
    const { role } = req.user;
    const { id } = req.params;
    if (!compareRoles(role, "admin")) {
      const { schoolId } = req.user;
      if (schoolId !== parseInt(id)) {
        console.log("Current School ID:", schoolId);
        console.log("Requested Class ID:", id);
        return res
          .status(403)
          .json({ error: "You can only access classes for your own school" });
      }
    }
    const classData = await services.getClassById(id);
    if (!classData) {
      return res.status(404).json({ error: "Class not found" });
    }
    res.status(200).json(classData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateClass = async (req, res) => {
  try {
    const { currentSchoolId, role } = req.user;
    const { id } = req.params;
    const { name, schoolId } = req.body;
    if (!compareRoles(role, "admin")) {
      if (currentSchoolId !== schoolId) {
        return res
          .status(403)
          .json({ error: "You can only update classes for your own school" });
      }
    }
    const updatedClass = await services.updateClass(id, { name, schoolId });
    if (!updatedClass) {
      return res.status(404).json({ error: "Class not found" });
    }
    res.status(200).json(updatedClass);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteClass = async (req, res) => {
  try {
    const { currentSchoolId, role } = req.user;
    const { id } = req.params;
    const classToDelete = await services.getClassById(id);
    if (!classToDelete) {
      return res.status(404).json({ error: "Class not found" });
    }
    if (!compareRoles(role, "admin")) {
      if (currentSchoolId !== classToDelete.schoolId) {
        return res
          .status(403)
          .json({ error: "You can only delete classes for your own school" });
      }
    }
    await services.deleteClass(id);
    res.status(200).json({ message: "Class deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllClassesForSchool = async (req, res) => {
  try {
    const { schoolId: userSchoolId, role } = req.user;
    const { schoolId: requestedSchoolId } = req.params;

    const isAdmin = compareRoles(role, "admin");
    const isSchoolAdmin = compareRoles(role, "school_admin");

    // 1. Block any role that isn't explicitly permitted
    if (!isAdmin && !isSchoolAdmin) {
      return res.status(403).json({ error: "Access denied" });
    }

    // 2. If school_admin, ensure they are only querying their own school
    // Converting both to String handles both integer IDs and UUIDs safely
    if (isSchoolAdmin && String(userSchoolId) !== String(requestedSchoolId)) {
      return res
        .status(403)
        .json({ error: "You can only access classes for your own school" });
    }

    // 3. Fetch classes using the requestedSchoolId from params
    const classes = await services.getAllClassesForSchool(requestedSchoolId);
    return res.status(200).json(classes);
  } catch (error) {
    // Consider using 500 for unexpected server/database errors unless you throw custom validation errors
    return res.status(400).json({ error: error.message });
  }
};

const getAllClassesForTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { role, schoolId: userSchoolId } = req.user;

    // 1. Block any role that isn't explicitly permitted
    if (!compareRoles(role, "admin") && !compareRoles(role, "school_admin")) {
      return res.status(403).json({ error: "Access denied" });
    }
    // 2. If school_admin, ensure they are only querying teachers from their own school
    if (compareRoles(role, "school_admin")) {
      // Fetch the teacher's schoolId from the database
      const teacher = await prisma.teacher.findUnique({
        where: { id: teacherId },
      });
      if (!teacher || teacher.schoolId !== userSchoolId) {
        return res.status(403).json({
          error: "You can only access classes for teachers in your own school",
        });
      }
    }
    const classes = await services.getAllClassesForTeacher(teacherId);
    res.status(200).json(classes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
  getAllClassesForSchool,
  getAllClassesForTeacher,
};
