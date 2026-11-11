const db = require("../prisma/db");
const jwt = require("jsonwebtoken");
const {  comparePasswords } = require("../../utils/password");
const { UnauthorizedError } = require("../../utils/errors");
const { generateRefreshToken, hashRefreshToken } = require("../../utils/token");

const User = db.user;

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET 

const login = async (identifier, password) => {
  const user = await User.findFirst({
    where: {
      OR: [{ username: identifier }, { email: identifier }],
    },
  });

  if (!user) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const isPasswordValid = await comparePasswords(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    ACCESS_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = generateRefreshToken();
  const hashedRefreshToken =  hashRefreshToken(refreshToken);
  await db.refreshToken.create({
    data: {
      tokenHash: hashedRefreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });
  return { accessToken, refreshToken };
};


const refreshToken = async (token) => {
  const hashedUserToken = hashRefreshToken(token);
  const storedToken = await db.refreshToken.findUnique({
    where: {
      tokenHash: hashedUserToken,
    },
  });

  if (!storedToken) {
    throw new UnauthorizedError("Invalid refresh token");
  }

  if (storedToken.revokeAt) {
    throw new UnauthorizedError("Refresh token revoked");
  }

  if (storedToken.expiresAt < new Date()) {
    throw new UnauthorizedError("Refresh token expired");
  }
  
  const user = await User.findUnique({
    where: { id: storedToken.userId },
  });
  
  if (!user) {
    throw new UnauthorizedError("User not found");
  }

  
  
  const result = await db.$transaction(async (tx) => {
    const revoked = await tx.refreshToken.updateMany({
      where: {
        id: storedToken.id,
        expiresAt: {
          gt: new Date()
        }
      },
      data: { revokeAt: new Date() }
    });

    const newRefreshToken = generateRefreshToken();
    const hashedNewRefreshToken = hashRefreshToken(newRefreshToken);
    await tx.refreshToken.create({
      data: {
        tokenHash: hashedNewRefreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });
    if (revoked.count !== 1) {
      throw new UnauthorizedError("Refresh token is no longer valid or has been revoked");
    }
    return newRefreshToken;
  });


  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    ACCESS_SECRET,
    { expiresIn: "15m" }
  );

  return { accessToken, refreshToken: result };
};
const getMe = async (userId) => {
  const user = await User.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  
  if (!user) {
    throw new UnauthorizedError("User not found");
  }

  return user;
};

module.exports = {
  login,
  refreshToken,
  getMe
};
