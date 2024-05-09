const httpStatus = require("http-status");
const bcrypt = require("bcryptjs");
const { User, Role } = require("../models");
const ApiError = require("../utils/ApiError");
const helper = require("../utils/Helper");
const messages = require("../config/messages");
// const otpService = require('./otp.service');
const userConfig = require("../config/user");
const { otpTypes } = require("../config/otp");

/**
 * filter User Data from request
 * @param data
 * @returns {*}
 * @private
 */
const _filterUserData = (data) => {
  return {
    firstName: data?.firstName,
    lastName: data?.lastName,
    email: data?.email,
    password: data?.password,
    username: data?.username,
    age: data?.age,
    height: data?.height,
    weight: data?.weight,
    city: data?.city,
    postalCode: data?.postalCode,
    gender: data?.gender,
    religion: data?.religion,
    relationshipIntention: data?.relationshipIntention,
    personalityVector: data?.personalityVector,
  };
};

/**
 * Filter Social Links data from request
 * @param data
 * @param roleId
 * @returns {{phoneNumber, roleId, name, email}}
 * @private
 */
const _filterSocialUserData = (data) => {
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    type: data.type,
    facebookId: data.facebookId,
    googleId: data.googleId,
    appleId: data.appleId,
    phoneNumber: data.phoneNumber,
    profileImage: data.profileImage,
  };
};

/**
 * Register User data
 * @param data
 * @param roleId
 * @returns {*}
 * @private
 */
const _filterRegisterData = (data, roleId) => {
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password,
    roleId,
    username: data.username,
  };
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<{user: *}>}
 */
const findById = async (_id) => {
  try {
    const user = await User.findById(_id).lean();
    if (!user) throw new Error();
    return user;
  } catch (e) {
    return false;
  }
};

/**
 * Validate Email and Username
 * @param userBody
 * @returns {Promise<void>}
 */
const validateEmailandUsername = async (userBody) => {
  const emailExists = await checkEmailValidity(userBody.email);
  const userNameExists = await checkUsernameValidity(userBody.username);

  // Check if email/username already exists
  if (!emailExists || !userNameExists) {
    let message = !emailExists ? "Email" : "";
    message += !userNameExists ? " Username" : "";

    throw new ApiError(httpStatus.BAD_REQUEST, `${message} already Exists`);
  }
};

/**
 * Fetch role from Database
 * @param role
 * @returns {*}
 */
const fetchRole = async (role) => {
  const userRole = await Role.findOne({ name: role });

  if (!userRole)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      messages.api.userStoreError
    );

  return userRole;
};

/**
 * find User by filters
 * @param filters
 * @param multiple
 * @returns {Promise<*>}
 */
const findByClause = async (filters, multiple = false) => {
  if (multiple) {
    return User.find(filters);
  }
  return User.findOne(filters);
};

/**
 * Create a user
 * @param {Object} userBody
 */
const createUser = async (userBody) => {
  try {
    await validateEmailandUsername(userBody);

    // const vectors = convertToVector(user_preferences);
    const item = await User.create(_filterUserData(userBody));
    if (!item) {
      throw new Error();
    }
    delete item._doc.password;

    return { ...item.toObject() };
  } catch (error) {
    console.log("error", error);
    return false;
  }
};

/**
 * Create a user against a new social login
 * @param userBody
 * @returns {*}
 */
const createSocialUser = async (userBody) => {
  try {
    // Create User
    const item = await User.create(_filterSocialUserData(userBody));
    if (!item) {
      throw new Error();
    }

    return { ...item.toObject() };
  } catch (error) {
    throw error;
  }
};

/**
 * Sign Up user
 * @param userBody
 * @returns {*}
 */
const registerUser = async (userBody) => {
  await validateEmailandUsername(userBody);

  // Create User
  const item = await User.create(_filterRegisterData(userBody, role._id));

  if (!item) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      messages.api.userStoreError
    );
  }

  return { ...item.toObject() };
};

/**
 * Check if email exists
 * @param email
 * @returns {Promise<boolean>}
 */
const checkEmailValidity = async (email) => {
  try {
    const user = await findByClause({ email });
    return !user;
  } catch (error) {
    return false;
  }
};

/**
 * check if username exists
 * @param username
 * @returns {Promise<boolean>}
 */
const checkUsernameValidity = async (username) => {
  try {
    const user = await findByClause({ username });
    return !user;
  } catch (error) {
    return false;
  }
};

module.exports = {
  findByClause,
  findById,
  createUser,
  createSocialUser,
  registerUser,
  checkUsernameValidity,
  checkEmailValidity,
  validateEmailandUsername,
};
