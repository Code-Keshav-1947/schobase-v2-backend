const authService = require('./auth.service');

const login = async (req, res, next) => {
    try {
        const { identifier, password } = req.body;
        const result = await authService.login(identifier, password);
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.cookie("accessToken", result.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.json({ accessToken: result.accessToken, refreshToken: result.refreshToken });
    } catch (error) {
        next(error);
    }
};


const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken: token } = req.body;
        const result = await authService.refreshToken(token);
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.cookie("accessToken", result.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res, next) => {
    try {
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        next(error);
    }
};

const getMe = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = await authService.getMe(userId);
        res.json(user);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    login,
    refreshToken,
    logout,
    getMe
};
