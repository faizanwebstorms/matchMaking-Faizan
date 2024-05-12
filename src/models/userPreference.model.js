const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const userConfig = require("../config/user");
/**
 * userPreference Schema Model
 * To store userPreference for every user
 */

const userPreferenceSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    genderPreference: {
      enum: userConfig.genderEnum,
      type: Number,
    },
    agePreference: {
      enum: userConfig.ageEnum,
      type: Number,
    },
    heightPreference: {
      enum: userConfig.heightEnum,
      type: Number,
    },
    bmiPreference: {
      enum: userConfig.bmiEnum,
      type: Number,
    },
    religionPreference: {
      enum: userConfig.religionEnum,
      type: Number,
    },
    locationPreference: {
      enum: userConfig.locationEnum,
      type: Number,
    },
    
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userPreferenceSchema.plugin(toJSON);

/**
 * @typedef userPreference
 */
const UserPreference = mongoose.model('UserPreference', userPreferenceSchema);

module.exports = UserPreference;
