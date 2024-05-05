const mongoose = require('mongoose');

/**
 * Roles Model Schema
 * To store all roles in Database
 */
const roleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

roleSchema.set('toObject', { virtuals: true, versionKey: false });
roleSchema.set('toJSON', { virtuals: true, versionKey: false });

/**
 * @typedef User
 */
module.exports = mongoose.model('Role', roleSchema);
