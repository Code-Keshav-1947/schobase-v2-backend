const createTeacher = async (teacherData) => {
  try {
    const teacher = await Teacher.create(teacherData);
    return teacher;
  } catch (error) {
    throw new Error("Error creating teacher: " + error.message);
  }
};

const getAllTeachers = async (page = 1, limit = 10, search = "") => {
  try {
    const offset = (page - 1) * limit;
    const teachers = await Teacher.findAll({
      offset,
      limit,
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
        ],
      },
    });
    return teachers;
  } catch (error) {
    throw new Error("Error fetching teachers: " + error.message);
  }
};

const getTeacherById = async (id) => {
  try {
    const teacher = await Teacher.findByPk(id);
    if (!teacher) {
      throw new Error("Teacher not found");
    }
    return teacher;
  } catch (error) {
    throw new Error("Error fetching teacher: " + error.message);
  }
};

const updateTeacher = async (id, teacherData) => {
  try {
    const teacher = await Teacher.findByPk(id);
    if (!teacher) {
      throw new Error("Teacher not found");
    }
    await teacher.update(teacherData);
    return teacher;
  } catch (error) {
    throw new Error("Error updating teacher: " + error.message);
  }
};

const deleteTeacher = async (id) => {
  try {
    const teacher = await Teacher.findByPk(id);
    if (!teacher) {
      throw new Error("Teacher not found");
    }
    await teacher.destroy();
    return { message: "Teacher deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting teacher: " + error.message);
  }
};

const getTeachersBySchoolId = async (
  schoolId,
  page = 1,
  limit = 10,
  search = ""
) => {
  try {
    const offset = (page - 1) * limit;
    const teachers = await Teacher.findAll({
      where: { schoolId },
      offset,
      limit,
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
        ],
      },
    });
    return teachers;
  } catch (error) {
    throw new Error("Error fetching teachers by school ID: " + error.message);
  }
};

module.exports = {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  getTeachersBySchoolId,
};
