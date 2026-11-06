const z = require('zod');

const registerSchema = z.object({
    name: z.string().min(3).max(30).trim(),
    bio: z.string().max(500).trim().optional(),
    email: z.string().email().trim().lowercase(),
    username: z.string().min(3).max(30).trim(),
    password: z.string().min(8).max(100).trim(),
});

const loginSchema = z.object({
    identifier: z.string().min(1).trim(),
    password: z.string().min(8).max(100).trim(),
});

const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1).trim(),
});

module.exports = {
    registerSchema,
    loginSchema,
    refreshTokenSchema,
};