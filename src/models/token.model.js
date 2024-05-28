const mongoose = require("mongoose");
const { toJSON } = require("./plugins");
const { tokenTypes } = require("../config/tokens");

/**
 * Token Schema Model
 * To store tokens for auth, email verification, and social media tokens
 */

const tokenSchema = mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: [
        tokenTypes.REFRESH,
        tokenTypes.VERIFY_EMAIL,
        tokenTypes.FACEBOOK_ACCESS,
        tokenTypes.GOOGLE_ACCESS,
        tokenTypes.APPLE_IDENTITY_TOKEN,
      ],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
tokenSchema.plugin(toJSON);

/**
 * @typedef Token
 */
const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;
