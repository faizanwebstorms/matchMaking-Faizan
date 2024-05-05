const mongoose = require('mongoose');
const { Schema } = require('mongoose');

/**
 * Model to Manage permissions assigned to roles
 * A many-to-many relationship
 */

const rolePermissionSchema = mongoose.Schema({
  // Role to assign permission to
  roleId: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    required: true,
    unique: false,
  },
  // Permission to be assigned to a role
  permissionId: {
    type: Schema.Types.ObjectId,
    ref: 'Permission',
    required: true,
    unique: false,
  },
});

/**
 * The combination of role and permission ID should be unique
 * To avoid duplicate records (resource optimization)
 */
rolePermissionSchema.index(
  {
    roleId: 1,
    permissionId: 1,
  },
  { unique: true }
);
rolePermissionSchema.set('toObject', { virtuals: true, versionKey: false });
rolePermissionSchema.set('toJSON', { virtuals: true, versionKey: false });

/**
 * @typedef User
 */
module.exports = mongoose.model('RolePermission', rolePermissionSchema);
