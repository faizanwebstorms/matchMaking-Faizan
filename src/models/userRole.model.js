const mongoose = require('mongoose');
const { Schema } = require('mongoose');

/**
 * Model to Manage Roles assigned to users
 * A many-to-many relationship
 */

const userRoleSchema = mongoose.Schema({
  // Role to be assigned to a user
  roleId: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    required: true,
    unique: false,
  },
  // User to assign role to
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: false,
  },
});

/**
 * The combination of role and permission ID should be unique
 * To avoid duplicate records (resource optimization)
 */
userRoleSchema.index(
  {
    roleId: 1,
    userId: 1,
  },
  { unique: true }
);

userRoleSchema.virtual('role', {
  ref: 'Role', // The Model to use
  localField: 'roleId', // Find in Model, where localField
  foreignField: '_id', // is equal to foreignField
  justOne: true,
});

userRoleSchema.set('toObject', { virtuals: true, versionKey: false });
userRoleSchema.set('toJSON', { virtuals: true, versionKey: false });

/**
 * @typedef User
 */
module.exports = mongoose.model('UserRole', userRoleSchema);
