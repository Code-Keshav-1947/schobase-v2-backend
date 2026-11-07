const authService = require('./auth.service');

const login = async (req, res, next) => {
    try {
        const { identifier, password } = req.body;
        const result = await authService.login(identifier, password);
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.json({ accessToken: result.accessToken });
    } catch (error) {
        next(error);
    }
};


const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken: token } = req.body;
        const result = await authService.refreshToken(token);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    login,
    register,
    refreshToken,
};
