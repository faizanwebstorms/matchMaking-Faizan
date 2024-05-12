const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

/**
 * QuestionnaireResponse Schema Model
 * To store QuestionnaireResponse for every user
 */

const questionnaireResponseSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    educationProfession: {
      type: String,
      required: true,
    },
    hobbiesPassions: {
      type: String,
      required: true,
    },
    kidsPets: {
      type: String,
      required: true,
    },
    valuesPersonality: {
      type: String,
      required: true,
    },
    greenFlags: {
      type: String,
      required: true,
    },
    redFlags: {
      type: String,
      required: true,
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
const QuestionnaireResponse = mongoose.model('QuestionnaireResponse', questionnaireResponseSchema);

module.exports = QuestionnaireResponse;
