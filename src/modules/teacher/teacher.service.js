const bcrypt = require("bcryptjs");
const db = require("../prisma/db");

const createTeacher = async (teacherData) => {
  try {
    const hashedPassword = await bcrypt.hash(teacherData.password, 10);

    return await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: teacherData.email,
          username: teacherData.username,
          password: hashedPassword,
          role: "TEACHER",
        },
      });

      return tx.teacher.create({
        data: {
          userId: user.id,
          schoolId: teacherData.schoolId,
        },
      });
    });
  } catch (error) {
    throw new Error(`Error creating teacher: ${error.message}`);
  }
};

const getAllTeachers = async (page = 1, limit = 10, search = "") => {
  try {
    const skip = (page - 1) * limit;

    return await db.teacher.findMany({
      skip,
      take: limit,
      where: search
        ? {
            user: {
              OR: [
                { username: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
              ],
            },
          }
        : undefined,
      include: {
        user: {
          select: { id: true, email: true, username: true, role: true },
        },
      },
    });
  } catch (error) {
    throw new Error(`Error fetching teachers: ${error.message}`);
  }
};

const getTeacherById = async (id) => {
  try {
    const teacher = await db.teacher.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, email: true, username: true, role: true },
        },
      },
    });

    if (!teacher) {
      throw new Error("Teacher not found");
    }

    return teacher;
  } catch (error) {
    throw new Error(`Error fetching teacher: ${error.message}`);
  }
};

const updateTeacher = async (id, teacherData) => {
  try {
    const existing = await db.teacher.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("Teacher not found");
    }

    return await db.teacher.update({
      where: { id },
      data: {
        ...(teacherData.schoolId !== undefined && {
          schoolId: teacherData.schoolId,
        }),
        ...(teacherData.email || teacherData.username
          ? {
              user: {
                update: {
                  ...(teacherData.email !== undefined && {
                    email: teacherData.email,
                  }),
                  ...(teacherData.username !== undefined && {
                    username: teacherData.username,
                  }),
                },
              },
            }
          : {}),
      },
      include: {
        user: {
          select: { id: true, email: true, username: true, role: true },
        },
      },
    });
  } catch (error) {
    throw new Error(`Error updating teacher: ${error.message}`);
  }
};

const deleteTeacher = async (id) => {
  try {
    const existing = await db.teacher.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("Teacher not found");
    }

    await db.teacher.delete({ where: { id } });
    return { message: "Teacher deleted successfully" };
  } catch (error) {
    throw new Error(`Error deleting teacher: ${error.message}`);
  }
};

const getTeachersBySchoolId = async (
  schoolId,
  page = 1,
  limit = 10,
  search = ""
) => {
  try {
    const skip = (page - 1) * limit;

    return await db.teacher.findMany({
      skip,
      take: limit,
      where: {
        schoolId,
        ...(search
          ? {
              user: {
                OR: [
                  { username: { contains: search, mode: "insensitive" } },
                  { email: { contains: search, mode: "insensitive" } },
                ],
              },
            }
          : {}),
      },
      include: {
        user: {
          select: { id: true, email: true, username: true, role: true },
        },
      },
    });
  } catch (error) {
    throw new Error(`Error fetching teachers by school ID: ${error.message}`);
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
