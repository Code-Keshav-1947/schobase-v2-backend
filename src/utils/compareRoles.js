const compareRoles = (roles, userRole) => {
  if (!Array.isArray(roles)) {
    roles = [roles];
  }
  return roles.some((role) => role.toLowerCase() === userRole.toLowerCase());
};

module.exports = compareRoles;
