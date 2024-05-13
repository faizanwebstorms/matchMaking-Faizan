const httpStatus = require("http-status");
const bcrypt = require("bcryptjs");
const { User, Role, QuestionnaireResponse, UserPreference } = require("../models");
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
 * filter Questionnaire Data from request
 * @param data
 * @returns {*}
 * @private
 */
const _filterResponseData = (data ,userId) => {
  return {
    userId: userId,
    educationProfession: data?.educationProfession,
    hobbiesPassions: data?.hobbiesPassions,
    kidsPets: data?.kidsPets,
    greenFlags: data?.greenFlags,
    redFlags: data?.redFlags,
    valuesPersonality: data?.valuesPersonality,
  };
};

/**
 * filter preference Data from request
 * @param data
 * @returns {*}
 * @private
 */
const _filterPreferenceData = (data ,userId) => {
  return {
    userId: userId,
    genderPreference: data?.genderPreference,
    agePreference: data?.agePreference,
    heightPreference: data?.heightPreference,
    bmiPreference: data?.bmiPreference,
    religionPreference: data?.religionPreference,
    locationPreference: data?.locationPreference,
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
  // const userNameExists = await checkUsernameValidity(userBody.username);

  // Check if email/username already exists
  if (!emailExists ) {
    let message = !emailExists ? "Email" : "";
    // message += !userNameExists ? " Username" : "";

    throw new ApiError(httpStatus.BAD_REQUEST, `${message} already Exists`);
  }
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
    throw error;
  }
};
/**
 * Create a user questionnaire response 
 * @param {Object} userBody
 */
const createResponse = async (responseBody , userId) => {
  try {
    const item = await QuestionnaireResponse.create(_filterResponseData(responseBody , userId));
    if (!item) {
      throw new Error();
    }
    return { ...item.toObject() };
  } catch (error) {
    console.log("error", error);
    throw error ;
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

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const update = async (user, updateBody) => {
  try {
    Object.assign(user, updateBody);
    await user.save();
    return  user ;
  } catch (e) {
    throw error;
  }
};

/**
 * Create a user questionnaire response 
 * @param {Object} userBody
 */
const createPreference = async (preferenceBody , userId) => {
  try {
    const item = await UserPreference.create(_filterPreferenceData(preferenceBody , userId));
    if (!item) {
      throw new Error();
    }
    return { ...item.toObject() };
  } catch (error) {
    console.log("error", error);
    throw error ;
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
  createResponse,
  update,
  createPreference
};
