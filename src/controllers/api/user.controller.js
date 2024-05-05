const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const userService = require('../../services/user.service');
// const otpService = require('../../services/otp.service');
const Helper = require('../../utils/Helper');
const messages = require('../../config/messages');
const { User } = require('../../models');

/**
 * Create User (For admin panel in future)
 * @type {(function(*, *, *): void)|*}
 */
const createUser = catchAsync(async (req, res) => {
  console.log('asdasdsadasd');
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(Helper.apiResponse(httpStatus.CREATED, messages.api.success, user));
});
/**
 * Get paginated users (For admin Panel)
 * @type {(function(*, *, *): void)|*}
 */
const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(Helper.apiResponse(httpStatus.OK, messages.api.success, result));
});

const getAllUsers = catchAsync(async (req, res) => {
  const options = pick(req.query, ['limit', 'page']);
  const keyword = [
    0.04153144732117653, 0.0008036745712112345, 0.003807373344898221, 0.11769875884056092, 0.2102378010749817,
    0.055723778903484344, 0.18494635920388794, 0.02430533431470399, 0.0014444207772612572, 0.01646110974252224,
    0.2884419858455658, 0.06975653767585754, 0.14280545711517334, 0.21855656802654266, 0.054865360260009766,
    0.2664768397808075, 0.15404537320137024, 0.07058555632829666, 0.2564086318016052, 0.025546366348862648,
    0.18019306659698486, 0.025199588388204575, 0.06954245269298553, 0.17014487087726594, 0.24414581060409546,
    0.2120237797498713, 0.08856579641369324, 0.07644421607255936, 0.11976826190948486,
  ];
  if (req.query.sortBy) {
    options.sort = {};
    // eslint-disable-next-line prefer-destructuring
    options.sort[req.query.sortBy.split(':')[0]] = req.query.sortBy.split(':')[1];
  }

  const aggregate = User.aggregate([
    {
      $vectorSearch: {
        queryVector: keyword,
        path: 'user_preferences', // Field containing vector data
        limit: 5,
        numCandidates: 100,
        index: 'userSearchIndex',
        // query: { $vector: { $literal: keywordEmbed } }, // Query vector
        // maxDistance: 0.2, // Maximum distance (cosine similarity threshold)
      },
    },
    // Add other pipeline stages here if needed
    {
      $project: {
        _id: 1,
      },
    },
  ]);
  console.log('aggregate', aggregate);

  let result;
  await Promise.resolve(
    User.aggregatePaginate(aggregate, {
      ...options,
    }).then(function (results, err) {
      if (err) throw new Error();
      result = results;
    })
  );

  res.send(Helper.apiResponse(httpStatus.OK, messages.api.success, result));
});

/**
 * Get User Details (Personal Information and Profile)
 * @type {(function(*, *, *): void)|*}
 */
const getUser = catchAsync(async (req, res) => {
  const user = await userService.findById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(Helper.apiResponse(httpStatus.OK, messages.api.success, user));
});

/**
 * Update user personal Information
 * @type {(function(*, *, *): void)|*}
 */
const updateUser = catchAsync(async (req, res) => {
  const user = await userService.update(req.params.userId, req.body);
  res.send(Helper.apiResponse(httpStatus.OK, messages.api.success, { user }));
});

/**
 * Update user profile
 * @type {(function(*, *, *): void)|*}
 */
const updateProfile = catchAsync(async (req, res) => {
  let user = await User.findById(req.user._id);
  const updateBody = req.body;

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, messages.api.userNotFound);
  }

  if (updateBody.email && updateBody.email !== user.email) {
    if (!(await userService.checkEmailValidity(updateBody.email))) {
      throw new ApiError(httpStatus.BAD_REQUEST, messages.api.emailAlreadyExists);
    }
  }

  if (updateBody.username && updateBody.username !== user.username) {
    if (!(await userService.checkUsernameValidity(updateBody.username))) {
      throw new ApiError(httpStatus.NOT_ACCEPTABLE, messages.api.usernameAlreadyExists);
    }
  }

  user = await userService.update(user, req.body);
  if (!user) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, messages.api.internalServerError);
  res.send(Helper.apiResponse(httpStatus.OK, messages.api.success, user));
});

/**
 * Delete a User (For admin Panel)
 * @type {(function(*, *, *): void)|*}
 */
const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send(Helper.apiResponse(httpStatus.NO_CONTENT, messages.api.success));
});

/**
 * Get Users list from contacts on New user Signup
 * @type {(function(*, *, *): void)|*}
 */
const getUsersByPhoneNumbers = catchAsync(async (req, res) => {
  const users = await userService.findByClause(
    {
      phoneNumber: { $in: req.body.phoneNumbers },
    },
    true
  );
  if (!users) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No User found');
  }
  res.send(Helper.apiResponse(httpStatus.OK, messages.api.success, users));
});

/**
 * Verify Password for changing Personal Information
 * @type {(function(*, *, *): void)|*}
 */
const verifyPassword = catchAsync(async (req, res) => {
  const verify = await userService.verifyPassword(req.body);
  if (verify) {
    res.send(Helper.apiResponse(httpStatus.OK, messages.api.success));
  } else {
    res.status(httpStatus.BAD_REQUEST).send(Helper.apiResponse(httpStatus.BAD_REQUEST, messages.api.passwordError));
  }
});

/**
 * Update Phone Number and Send OTP for verification
 * @type {(function(*, *, *): void)|*}
 */
const updatePhone = catchAsync(async (req, res) => {
  const user = await userService.update(req.user._id, { phoneNumber: req.body.phoneNumber });
  if (user) {
    // await otpService.updatePhoneVerificationOTP(user._id);
    res.send(Helper.apiResponse(httpStatus.OK, messages.api.success));
  } else {
    res.status(httpStatus.NOT_FOUND).send(Helper.apiResponse(httpStatus.NOT_FOUND, messages.api.userNotFound));
  }
});

/**
 * Verify Phone OTP
 * @type {(function(*, *, *): void)|*}
 */
const verifyPhoneOTP = catchAsync(async (req, res) => {
  const verified = await userService.verifyPhoneOTP(req.body.otp, req.user);
  if (verified) {
    res.send(Helper.apiResponse(httpStatus.OK, messages.api.success));
  } else {
    res.status(httpStatus.BAD_REQUEST).send(Helper.apiResponse(httpStatus.BAD_REQUEST, messages.api.codeExpired));
  }
});

/**
 * Get User Profile
 * @type {(function(*, *, *): void)|*}
 */
const getProfile = catchAsync(async (req, res) => {
  const userId = req.query.userId ? req.query.userId : req.user._id;
  const user = await userService.getProfile(userId, req.user._id);

  if (!user) throw new ApiError(httpStatus.BAD_REQUEST, messages.api.userNotFound);

  res.send(Helper.apiResponse(httpStatus.OK, messages.api.success, { user }));
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  getUsersByPhoneNumbers,
  updateUser,
  updateProfile,
  deleteUser,
  verifyPassword,
  updatePhone,
  verifyPhoneOTP,
  getProfile,
  getAllUsers,
};
