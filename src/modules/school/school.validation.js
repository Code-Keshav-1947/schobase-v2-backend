const { z } = require("zod");
const createSchoolSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  website: z.string().url("Invalid website URL").optional(),
  establishedYear: z
    .number()
    .int()
    .min(1800, "Established year must be a valid year")
    .max(new Date().getFullYear(), "Established year cannot be in the future"),
});

const updateSchoolSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  address: z.string().min(1, "Address is required").optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().min(1, "Phone number is required").optional(),
  website: z.string().url("Invalid website URL").optional(),
  establishedYear: z
    .number()
    .int()
    .min(1800, "Established year must be a valid year")
    .max(new Date().getFullYear(), "Established year cannot be in the future")
    .optional(),
});

const getSchoolByIdSchema = z.object({
  id: z.string().uuid("Invalid school ID").min(1, "School ID is required"),
});

const deleteSchoolSchema = z.object({
  id: z.string().uuid("Invalid school ID").min(1, "School ID is required"),
});

const getAllSchoolsSchema = z.object({
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).optional(),
  search: z.string().optional(),
});

module.exports = {
  createSchoolSchema,
  updateSchoolSchema,
  getSchoolByIdSchema,
  deleteSchoolSchema,
  getAllSchoolsSchema,
};
