const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

/**
 * QuestionnaireResponse Schema Model
 * To store QuestionnaireResponse for every user
 */

const questionnaireResponseSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    educationProfession: {
      type: String,
    },
    hobbiesPassions: {
      type: String,
    },
    kidsPets: {
      type: String,
    },
    valuesPersonality: {
      type: String,
    },
    greenFlags: {
      type: String,
    },
    redFlags: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
questionnaireResponseSchema.plugin(toJSON);

/**
 * @typedef QuestionnaireResponse
 */
const QuestionnaireResponse = mongoose.model(
  "QuestionnaireResponse",
  questionnaireResponseSchema
);

module.exports = QuestionnaireResponse;
