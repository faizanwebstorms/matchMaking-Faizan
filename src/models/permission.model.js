const mongoose = require('mongoose');

/**
 * Permission Model Schema
 * To store permissions in DB
 */

const permissionSchema = mongoose.Schema(
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

permissionSchema.set('toObject', { virtuals: true, versionKey: false });
permissionSchema.set('toJSON', { virtuals: true, versionKey: false });

/**
 * @typedef User
 */
module.exports = mongoose.model('Permission', permissionSchema);
