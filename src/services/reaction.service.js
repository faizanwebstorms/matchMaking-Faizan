const httpStatus = require("http-status");
const bcrypt = require("bcryptjs");

const ApiError = require("../utils/ApiError");
const helper = require("../utils/Helper");
const messages = require("../config/messages");
const { Reaction } = require("../models");

/**
 * CREATE A REACTION IF DOESNT EXIST BEFOR OTHERWISE UPDATE IT
 * @param {Object} userBody
 */

const handleReactionCreation = async (
  requestingUserId,
  requestedUserId,
  type
) => {
  try {
    let reaction = await Reaction.findOne({
      reactedBy: requestingUserId,
      reactedTo: requestedUserId,
    });
    if (reaction) {
      Object.assign(reaction, { type: type });
      await reaction.save();
    } else {
      reaction = await Reaction.create({
        reactedBy: requestingUserId,
        reactedTo: requestedUserId,
        type: type,
      });
      if (!reaction) {
        throw new Error("Error while creacting a reaction");
      }
    }
    return reaction;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a Reaction
 * @param {Object} userBody
 */
const createReaction = async (body) => {
  try {
    const item = await handleReactionCreation(
      body.reactedBy,
      body.reactedTo,
      body.type
    );
    if (!item) {
      throw new Error();
    }
    return { ...item.toObject() };
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

module.exports = {
  createReaction,
  handleReactionCreation,
};
