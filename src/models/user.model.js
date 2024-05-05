const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const { toJSON, paginate } = require('./plugins');
const userConfig = require('../config/user');



const socialsSchema = mongoose.Schema({
  instagram: String,
  facebook: String,
  twitter: String,
  _id: false,
});

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    phoneNumber: String,
    // isPhoneVerified: {
    //   type: Boolean,
    //   default: true,
    // },
    dateOfBirth: Date,
    profileImage: String,
    bio: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
    },
    isLocation: {
      type: Boolean,
      default: true,
    },
    gender: String,
    pronouns: String,

    // Unique Identifier for on of the settings screen
    uuid: String,

    // User Statuses: pending for incomplete signup, active for completed signup
    status: {
      type: Number,
      enum: userConfig.getStatuses,
      default: userConfig.status.active,
    },
    // User Types: Standard, facebook, google, apple
    type: {
      type: Number,
      enum: userConfig.getTypes,
      default: userConfig.types.STANDARD,
    },
    socials: {
      type: socialsSchema,
    },

    // Social Media Ids
    facebookId: String,
    googleId: String,
    appleId: String,
    user_preferences: [String],
  },

  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);
userSchema.plugin(aggregatePaginate);

// Set Object and Json property to true. Default is set to false
userSchema.set('toObject', { virtuals: true, versionKey: false });
userSchema.set('toJSON', { virtuals: true, versionKey: false });

// userSchema.virtual('socials', {
//   ref: 'Social', // The Model to use
//   localField: '_id', // Find in Model, where localField
//   foreignField: 'userId', // is equal to foreignField
// });

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

// Check if password is updated and hash password while saving
userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// Username Unique validation
userSchema.pre('save', function (next) {
  const self = this;
  if (!this.uuid) {
    this.uuid = uuid.v4();
  }
  if (self.isModified('username')) {
    User.find({ username: self.username }, function (err, docs) {
      if (!docs.length) {
        next();
      } else {
        next(new Error('Username already exists!'));
      }
    });
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
