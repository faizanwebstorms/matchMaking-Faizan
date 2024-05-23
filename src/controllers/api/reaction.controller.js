const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const reactionService = require('../../services/reaction.service');
const Helper = require('../../utils/Helper');
const messages = require('../../config/messages');



/**
 * Create User Questionnare Response
 * @type {(function(*, *, *): void)|*}
 */
const createUserReaction = catchAsync(async (req, res) => {
  const response = await reactionService.createReaction(req.body );
  res.status(httpStatus.CREATED).send(Helper.apiResponse(httpStatus.CREATED, messages.api.success, response));
});









module.exports = {
  createUserReaction
};