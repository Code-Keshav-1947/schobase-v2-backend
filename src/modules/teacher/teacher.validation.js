const z = require("zod");

const createTeacherSchema = z.object({
  username: z
    .string()
    .min(2, "Username must be at least 2 characters long")
    .max(50),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(100),
  name: z.string().min(2, "Name must be at least 2 characters long").max(100),
  email: z.string().email("Please provide a valid email address"),
  schoolId: z.string(),
});

const updateTeacherSchema = z.object({
  username: z
    .string()
    .min(2, "Username must be at least 2 characters long")
    .max(50)
    .optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(100)
    .optional(),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(100)
    .optional(),
  email: z.string().email("Please provide a valid email address").optional(),
  schoolId: z.string().uuid("Please provide a valid school ID").optional(),
});

module.exports = {
  createTeacherSchema,
  updateTeacherSchema,
};
