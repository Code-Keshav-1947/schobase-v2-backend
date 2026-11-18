const z = require("zod");

const createClassSchema = z.object({
  name: z.string().trim().min(1, { message: "Class name is required" }),
  schoolId: z.string(),
});

const updateClassSchema = z.object({
  name: z.string().trim().min(1, { message: "Class name is required" }),
  schoolId: z.string(),
});

module.exports = {
  createClassSchema,
  updateClassSchema,
};
