const mongoose = require("mongoose");
const { toJSON } = require("./plugins");
const userConfig = require("../config/user");
/**
 * userPreference Schema Model
 * To store userPreference for every user
 */

const userPreferenceSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      index: true
    },
    genderPreference: {
      enum: userConfig.genderPreferenceEnum,
      type: Number,
      index: true
    },
    agePreference: {
      enum: userConfig.ageEnum,
      type: Number,
      index: true
    },
    heightPreference: {
      enum: userConfig.heightEnum,
      type: Number,
      index: true
    },
    bmiPreference: {
      enum: userConfig.bodyTypePreferenceEnum,
      type: Number,
      index: true
    },
    religionPreference: {
      enum: userConfig.religionPreferecneEnum,
      type: Number,
      index: true
    },
    relationshipIntention: {
      enum: userConfig.intentionEnum,
      type: Number,
      index: true
    },
    locationPreference: {
      enum: userConfig.locationEnum,
      type: Number,
      index: true
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
const UserPreference = mongoose.model("UserPreference", userPreferenceSchema);

module.exports = UserPreference;
