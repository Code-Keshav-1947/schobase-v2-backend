const crypto = require('crypto');
const generateRefreshToken = () => {
  const refreshToken = crypto.randomBytes(64).toString('hex');
  return refreshToken;
};

const hashRefreshToken =  (refreshToken) => {
  const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
  return hashedRefreshToken;
}

module.exports = {
  generateRefreshToken,
  hashRefreshToken
};