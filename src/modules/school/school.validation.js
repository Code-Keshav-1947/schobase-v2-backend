const { z } = require("zod");
const createSchoolSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  address: z.string().trim().min(1, "Address is required"),
  email: z.string().trim().email("Invalid email address"),
  phone: z.string().trim().min(1, "Phone number is required"),
  website: z
    .string()
    .trim()
    .url("Invalid website URL")
    .optional()
    .or(z.literal("")),
  establishedYear: z.coerce
    .number()
    .int("Established year must be a whole number")
    .min(1800, "Established year must be a valid year")
    .max(new Date().getFullYear(), "Established year cannot be in the future")
    .optional(),
});

const updateSchoolSchema = z.object({
  name: z.string().trim().min(1, "Name is required").optional(),
  address: z.string().trim().min(1, "Address is required").optional(),
  email: z.string().trim().email("Invalid email address").optional(),
  phone: z.string().trim().min(1, "Phone number is required").optional(),
  website: z.string().trim().url("Invalid website URL").optional(),
  establishedYear: z
    .number()
    .int()
    .min(1800, "Established year must be a valid year")
    .max(new Date().getFullYear(), "Established year cannot be in the future")
    .optional(),
});

module.exports = {
  createSchoolSchema,
  updateSchoolSchema,
};
