const httpStatus = require("http-status");
const bcrypt = require("bcryptjs");
const {
  User,
  Role,
  QuestionnaireResponse,
  UserPreference,
  Reaction,
} = require("../models");
const ApiError = require("../utils/ApiError");
const helper = require("../utils/Helper");
const messages = require("../config/messages");
// const otpService = require('./otp.service');
const userConfig = require("../config/user");
const {type} = require ('../config/reaction')
const { otpTypes } = require("../config/otp");
const axios = require("axios");
const { handleReactionCreation } = require("./reaction.service");

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
const _filterResponseData = (data, userId) => {
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
const _filterPreferenceData = (data, userId) => {
  return {
    userId: userId,
    genderPreference: data?.genderPreference,
    agePreference: data?.agePreference,
    heightPreference: data?.heightPreference,
    bmiPreference: data?.bmiPreference,
    religionPreference: data?.religionPreference,
    locationPreference: data?.locationPreference,
    relationshipIntention: data?.relationshipIntention,
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
  if (!emailExists) {
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
 * Caclute BMI and body type
 * @param filters
 * @param multiple
 * @returns {Promise<*>}
 */
const calculateBMI = (weight, height) => {
  const bmi = weight / (height / 100) ** 2;
  // Determine body type based on BMI
  let bodyType;
  switch (true) {
    case bmi < 18.5:
      return (bodyType = userConfig.bodyType.UNDERWEIGHT);

    case bmi >= 18.5 && bmi < 25:
      bodyType = userConfig.bodyType.NORMALWEIGHT;
      break;
    case bmi >= 25 && bmi < 30:
      bodyType = userConfig.bodyType.OVERWEIGHT;
      break;
    default:
      bodyType = userConfig.bodyType.OBESE;
  }

  return { bmi, bodyType };
};
/**
 * CALCULATE LONGITUDE AND LATITUDE FROM POSTAL CODE
 * @param filters
 * @param multiple
 * @returns {Promise<*>}
 */

async function getCoordinatesFromPostalCode(postalCode) {
  try {
    const mapAddress = "https://maps.googleapis.com/maps/api/geocode/json";
    const apiKey = "AIzaSyBGm8JnJuyLBjlfBX1z8NAVefFeKWIYNc4";
    const response = await axios.get(
      `${mapAddress}?address=${postalCode}&key=${apiKey}`
    );
    // Check if the response is successful and contains results
    if (response.data.status === "OK" && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      const latitude = location.lat;
      const longitude = location.lng;

      return { latitude, longitude };
    } else {
      throw new Error("Failed to fetch coordinates from postal code");
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error.message);
    throw error;
  }
}

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
const createResponse = async (responseBody, userId) => {
  try {
    const item = await QuestionnaireResponse.create(
      _filterResponseData(responseBody, userId)
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
    if (updateBody?.height && updateBody?.weight) {
      const bmiCalculator = await calculateBMI(
        updateBody?.weight,
        updateBody?.height
      );
      Object.assign(user, {
        bmi: bmiCalculator.bmi,
        bodyType: bmiCalculator.bodyType,
      });
    }
    if (updateBody?.postalCode) {
      const coordinates = await getCoordinatesFromPostalCode(
        updateBody?.postalCode
      );
      Object.assign(user, {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      });
    }
    Object.assign(user, updateBody);
    await user.save();
    return user;
  } catch (e) {
    throw error;
  }
};

/**
 * Create a user questionnaire response
 * @param {Object} userBody
 */
const createPreference = async (preferenceBody, userId) => {
  try {
    const item = await UserPreference.create(
      _filterPreferenceData(preferenceBody, userId)
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

const getAllUsers = async (userId, options) => {
  try {
    const userPreferences = await UserPreference.findOne({ userId });
    if (!userPreferences) {
      throw new Error();
    }
    let matchCriteria = {
      _id: { $ne: userId },
    };

    // Check if the user has set a gender preference
    if (userPreferences && userPreferences.genderPreference) {
      const preferredGender = userPreferences.genderPreference;

      // If the preferred gender is not 0 (which stands for 'Any'), add the gender criteria
      if (preferredGender !== 0) {
        matchCriteria.gender = preferredGender;
      }
    }
    const aggregate = User.aggregate([
      {
        $match: matchCriteria,
      },
    ]);
    let result;
    await Promise.resolve(
      User.aggregatePaginate(aggregate, {
        ...options,
      }).then(function (results, err) {
        if (err) throw new Error();
        result = results;
      })
    );
    return result;
  } catch (error) {
    throw error;
  }
};

const checkMatch = async (requestingUserId, requestedUserId) => {
  try {
    //  CREATE A REACTION IF DOESNT EXIST BEFOR OTHERWISE UPDATE IT
    const reaction = await handleReactionCreation(requestingUserId , requestedUserId , type.LIKE );
    if(!reaction){
      throw new Error (" Error While Creating Reaction")
    }

    // FETCH PREFERENCES FOR BOTH USERS
    const requestingUserPref = await UserPreference.findOne({
      userId: requestingUserId,
    });
    const requestedUserPref = await UserPreference.findOne({
      userId: requestedUserId,
    });

    if (!requestingUserPref || !requestedUserPref) {
      throw new Error("User preferences not found for one or both users.");
    }

    // DEFINE THE FIELDS TO COMPARE
    const fieldsToCompare = [
      "genderPreference",
      "agePreference",
      "heightPreference",
      "bmiPreference",
      "religionPreference",
      "relationshipIntention",
      "locationPreference",
    ];
    let matchCount = 0;

    // COMPARE PREFERENCES
    fieldsToCompare.forEach((field) => {
      if (requestingUserPref[field] === requestedUserPref[field]) {
        matchCount++;
      }
    });
    // CALCULATE MATCH PERCENTAGE
    const matchPercentage = (matchCount / fieldsToCompare.length) * 100;
    
    if (matchPercentage >= 60) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Update Preference by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updatePreference = async (preference, updateBody) => {
  try {
    Object.assign(preference, updateBody);
    await preference.save();
    return preference;
  } catch (e) {
    throw error;
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
  createPreference,
  getAllUsers,
  checkMatch,
  updatePreference
};
