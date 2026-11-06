const db = require('../prisma/db');
const User = db.user;
const Profile = db.profile;
const jwt = require('jsonwebtoken');
const { hashPassword, comparePasswords } = require('../../utils/password');

const login = async (identifier, password) => {
    const user = await User.findFirst({
        where: {
            OR: [
                { username: identifier },
                { email: identifier }
            ]
        }
    });
    if (!user) {
        throw new Error('User not found');
    }
    // Add password verification logic here
    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid password');
    }
    // Generate access and refresh tokens
    const accessToken = jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};

const register = async (name,username, email, password) => {
    const hashedPassword = await hashPassword(password);
    const [user,profile] = await db.$transaction(async (tx) => {
      // 1. Create the user first so we get the generated ID
      const newUser = await tx.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
      });

      // 2. Pass the new user's ID into the profile creation
      const newProfile = await tx.profile.create({
        data: {
          userId: newUser.id,
          name,
        },
      });

      return [newUser, newProfile];
    });

    return {
        id: user.id,
        username: user.username,
        email: user.email,
        profile: {
            id: user.profile.id,
            name: user.profile.name,
        },
    };
};

const refreshToken = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findUnique({ where: { id: decoded.userId } });
        if (!user) {
            throw new Error('User not found');
        }
        // Generate new access and refresh tokens
        const accessToken = jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new Error('Invalid refresh token');
    }
};

module.exports = {
    login,
    register,
    refreshToken
};