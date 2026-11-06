const authService = require('./auth.service');

const login = async (req, res) => {
    const { identifier, password } = req.body;
    const { accessToken, refreshToken } = await authService.login(identifier, password);
    res.json({ accessToken, refreshToken });
}

const register = async (req, res) => {
    const { username, email, password } = req.body;
    const user = await authService.register(username, email, password);
    res.status(201).json(user);
}

const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    const { accessToken, newRefreshToken } = await authService.refreshToken(refreshToken);
    res.json({ accessToken, refreshToken: newRefreshToken });
}