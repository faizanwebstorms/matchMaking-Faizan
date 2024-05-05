const roles = require('./roles');
const { resources, permissions } = require('./permissions');

module.exports.grantList = [
  // Role: User

  // resource: users
  { role: roles.user, resource: resources.users, action: permissions.readOwn },
  { role: roles.user, resource: resources.users, action: permissions.updateOwn },
  { role: roles.user, resource: resources.users, action: permissions.deleteOwn },

];
