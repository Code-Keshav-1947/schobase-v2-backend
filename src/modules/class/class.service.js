const getAllClasses = async (page = 1, limit = 10, search = "") => {
  try {
    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedLimit = Math.max(1, parseInt(limit, 10) || 10);
    const offset = (parsedPage - 1) * parsedLimit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const classes = await prisma.class.findMany({
      where,
      skip: offset,
      take: parsedLimit,
    });

    const total = await prisma.class.count({ where });

    return {
      classes,
      meta: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: Math.ceil(total / parsedLimit),
      },
    };
  } catch (error) {
    console.error("Error fetching classes:", error);
    throw new Error("Error fetching classes");
  }
};

const getClassById = async (id) => {
  try {
    const classData = await prisma.class.findUnique({
      where: { id },
    });
    if (!classData) {
      throw new Error("Class not found");
    }
    return classData;
  } catch (error) {
    throw new Error("Error fetching class by ID");
  }
};

const createClass = async (classData) => {
  try {
    const newClass = await prisma.class.create({
      data: classData,
    });
    return newClass;
  } catch (error) {
    throw new Error("Error creating class");
  }
};

const updateClass = async (id, classData) => {
  try {
    const updatedClass = await prisma.class.update({
      where: { id },
      data: classData,
    });
    return updatedClass;
  } catch (error) {
    throw new Error("Error updating class");
  }
};

const deleteClass = async (id) => {
  try {
    await prisma.class.delete({
      where: { id },
    });
    return { message: "Class deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting class");
  }
};

const getAllClassesForSchool = async (schoolId) => {
  try {
    const classes = await prisma.class.findMany({
      where: { schoolId },
    });
    return classes;
  } catch (error) {
    throw new Error("Error fetching classes for school");
  }
};

const getAllClassesForTeacher = async (teacherId) => {
  try {
    const classes = await prisma.class.findMany({
      where: { teacherId },
    });
    return classes;
  } catch (error) {
    throw new Error("Error fetching classes for teacher");
  }
};

module.exports = {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  getAllClassesForSchool,
  getAllClassesForTeacher,
};
