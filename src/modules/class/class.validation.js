const z = require("zod");

const createClassSchema = z.object({
  name: z.string().trim().min(1, { message: "Class name is required" }),
  schoolId: z.string().min(1, { message: "School ID is required" }),
});

const updateClassSchema = z.object({
  name: z.string().trim().min(1, { message: "Class name is required" }),
  schoolId: z.string().min(1, { message: "School ID is required" }),
});

module.exports = {
  createClassSchema,
  updateClassSchema,
};
