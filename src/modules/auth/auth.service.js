const db = require("../prisma/db");
const jwt = require("jsonwebtoken");
const { hashPassword, comparePasswords } = require("../../utils/password");
const { UnauthorizedError, ConflictError } = require("../../utils/errors");

const User = db.user;

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || "schobase-dev-access-secret-key-2026";
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || "schobase-dev-refresh-secret-key-2026";

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

  const refreshToken = jwt.sign(
    { userId: user.id },
    REFRESH_SECRET,
    { expiresIn: "7d" }
  );
  
  return { accessToken, refreshToken };
};


const refreshToken = async (token) => {
  try {
    const decoded = jwt.verify(token, REFRESH_SECRET);
    const user = await User.findUnique({ where: { id: decoded.userId } });

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    const newRefreshToken = jwt.sign(
      { userId: user.id },
      REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    return { accessToken, refreshToken: newRefreshToken };
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    throw new UnauthorizedError("Invalid or expired refresh token");
  }
};

module.exports = {
  login,
  register,
  refreshToken,
};
