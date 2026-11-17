const db = require("../prisma/db");

const createSchool = async (schoolData) => {
  try {
    const school = await db.school.create({
      data: schoolData,
    });
    return school;
  } catch (error) {
    throw new Error("Error creating school");
  }
};

const getSchoolById = async (id) => {
  try {
    const school = await db.school.findUnique({
      where: { id },
    });
    return school;
  } catch (error) {
    throw new Error("Error fetching school");
  }
};

const updateSchool = async (id, schoolData) => {
  try {
    const school = await db.school.update({
      where: { id },
      data: schoolData,
    });
    return school;
  } catch (error) {
    throw new Error("Error updating school");
  }
};

const deleteSchool = async (id) => {
  try {
    const school = await db.school.delete({
      where: { id },
    });
    return school;
  } catch (error) {
    throw new Error("Error deleting school");
  }
};

const getAllSchools = async (page = 1, limit = 10, search = "") => {
  try {
    const offset = (page - 1) * limit;
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { address: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};
    const schools = await db.school.findMany({
      where,
      skip: offset,
      take: limit,
    });
    const total = await db.school.count({ where });
    return { schools, meta: { total, page, limit } };
  } catch (error) {
    throw new Error("Error fetching schools");
  }
};

module.exports = {
  createSchool,
  getSchoolById,
  updateSchool,
  deleteSchool,
  getAllSchools,
};
