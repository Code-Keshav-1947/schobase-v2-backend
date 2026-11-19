const services = require("./class.service");

const createClass = async (req, res) => {
  try {
    const { role } = req.user;
    if (
      role.toLowerCase() !== "schoolAdmin" &&
      role.toLowerCase() !== "admin"
    ) {
      return res
        .status(403)
        .json({ error: "Only school admins and admins can create classes" });
    }
    const { currentSchoolId } = req.user;
    const { name, schoolId } = req.body;
    if (role.toLowerCase() === "schoolAdmin" && currentSchoolId !== schoolId) {
      return res.status(403).json({
        error: "School admins can only create classes for their own school",
      });
    }
    const newClass = await services.createClass({ name, schoolId });
    res.status(201).json(newClass);
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
    if (role.toLowerCase() !== "admin" && role.toLowerCase() !== "admin") {
      const { currentSchoolId } = req.user;
      if (currentSchoolId !== parseInt(id)) {
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
    if (role.toLowerCase() !== "admin") {
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
    if (role.toLowerCase() !== "admin" && role.toLowerCase() !== "admin") {
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
    const { currentSchoolId, role } = req.user;
    const { schoolId } = req.params;
    if (role.toLowerCase() === "admin") {
      const classes = await services.getAllClassesForSchool(schoolId);
    }
    if (
      role.toLowerCase() === "schooladmin" &&
      currentSchoolId !== parseInt(schoolId)
    ) {
      return res
        .status(403)
        .json({ error: "You can only access classes for your own school" });
    }
    const classes = await services.getAllClassesForSchool(schoolId);
    res.status(200).json(classes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllClassesForTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const classes = await services.getAllClassesForTeacher(teacherId);
    //TODO: Add role-based access control for this endpoint if needed
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
