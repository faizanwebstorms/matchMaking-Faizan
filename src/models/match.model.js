const mongoose = require("mongoose");
const { toJSON } = require("./plugins");
/**
 * MAtches Schema Model
 * To store Matches for every user
 */

const matchSchema = mongoose.Schema(
  {
    matchedBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    matchedTo: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    active: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
matchSchema.plugin(toJSON);

/**
 * @typedef match
 */
const Match = mongoose.model("Match", matchSchema);

module.exports = Match;
