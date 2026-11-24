const service = require("./teacher.service");
const compareRoles = require("../../utils/compareRoles");
const getAllTeachers = async (req, res) => {
  const { page, limit, search } = req.query;
  const { role } = req.user;
  console.log("User role:", req.user);
  try {
    if (compareRoles(["admin"], role)) {
      const teachers = await service.getAllTeachers(
        parseInt(page) || 1,
        parseInt(limit) || 10,
        search || ""
      );
      res.status(200).json(teachers);
    } else if (compareRoles(["school_admin"], role)) {
      console.log("User schoolId:", req.user.schoolId);

      const teachers = await service.getTeachersBySchoolId(
        req.user.schoolId,
        parseInt(page) || 1,
        parseInt(limit) || 10,
        search || ""
      );
      res.status(200).json(teachers);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const createTeacher = async (req, res) => {
  try {
    const teacher = await service.createTeacher(req.body);
    res.status(201).json(teacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTeacherById = async (req, res) => {
  const { id } = req.params;
  try {
    if (compareRoles(["admin"], req.user.role)) {
      const teacher = await service.getTeacherById(id);
      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }
      res.status(200).json(teacher);
    }
    if (compareRoles(["school_admin"], req.user.role)) {
      const teacher = await service.getTeacherById(id);
      if (teacher && teacher.schoolId !== req.user.schoolId) {
        return res.status(403).json({ message: "Access denied" });
      }
      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }
      res.status(200).json(teacher);
      // TODO: Add logic for other roles if needed
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllTeachers,
  createTeacher,
  getTeacherById,
};
