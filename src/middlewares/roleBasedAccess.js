const {unauthorizedError,ForbiddenError} = require('../utils/errors');
const roleBasedAccess = (allowedRoles) => {
  return (req, res, next) => {
    let userRole = req.user.role; 
    if (!userRole) {
      throw new unauthorizedError("Access denied. User role not found.");
    }
    userRole = userRole.toLowerCase(); // Convert the user's role to lowercase for comparison
    allowedRoles = allowedRoles.map(role => role.toLowerCase()); // Convert allowed roles to lowercase for comparison
    if (!allowedRoles.includes(userRole)) {
      throw new ForbiddenError("Access denied. Insufficient permissions.");
    }
    next();
  };
};

module.exports = roleBasedAccess;