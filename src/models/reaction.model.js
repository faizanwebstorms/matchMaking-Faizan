const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const reactionConfig = require("../config/reaction");
/**
 * reaction Schema Model
 * To store reaction for every user
 */

const reactionSchema = mongoose.Schema(
  {
    reactedBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    reactedTo: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    type:{
      enum: reactionConfig.typeEnum,
      type: Number
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
reactionSchema.plugin(toJSON);

/**
 * @typedef reaction
 */
const Reaction = mongoose.model('Reaction', reactionSchema);

module.exports = Reaction;
