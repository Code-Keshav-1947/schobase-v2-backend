const z = require('zod');


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