const AccessControl = require('accesscontrol');
const { UserRole } = require('../models');
const { grantList } = require('../config/grantList');

const ac = new AccessControl(grantList);

const getRoles = async (userId) => {
  const userRoles = await UserRole.find({ userId }).populate('role').lean();
  return userRoles.map((item) => {
    return item.role.name;
  });
};

const hasPermission = (roles, resource, requiredRight) => {
  let allowed = false;
  roles.map((item) => {
    switch (requiredRight) {
      case 'create:any':
        allowed = ac.can(item).createAny(resource);
        break;
      case 'read:any':
        allowed = ac.can(item).readAny(resource);
        break;
      case 'update:any':
        allowed = ac.can(item).updateAny(resource);
        break;
      case 'delete:any':
        allowed = ac.can(item).deleteAny(resource);
        break;
      case 'create:own':
        allowed = ac.can(item).createOwn(resource);
        break;
      case 'update:own':
        allowed = ac.can(item).updateOwn(resource);
        break;
      case 'read:own':
        allowed = ac.can(item).readOwn(resource);
        break;
      case 'delete:own':
        allowed = ac.can(item).deleteOwn(resource);
        break;
      default:
        break;
    }
    return '';
  });

  return allowed;
};

module.exports = {
  getRoles,
  hasPermission,
};
