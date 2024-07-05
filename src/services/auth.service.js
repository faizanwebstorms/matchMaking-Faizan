const tokenService = require("./token.service");
const userService = require("./user.service");
const { Token, OTP, User, UserPreference, Match } = require("../models");
const { tokenTypes } = require("../config/tokens");
const { otpTypes } = require("../config/otp");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const login = async (email, password) => {
  try {
    const user = await userService.findByClause({
      $or: [{ email }, { username: email }],
    });
    if (!user || !(await user.isPasswordMatch(password))) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Incorrect email/username or password"
      );
    }

    //Get matchewd user
    const isMatchExists = await Match.findOne({
      $and: [
        {
          $or: [{ matchedBy: user?._id }, { matchedTo: user?._id }],
        },
        { active: true },
      ],
    });

    if (isMatchExists) {
      let matchedUserId;

      // Check if the user is matchedBy or matchedTo and set matchedUserId accordingly
      if (isMatchExists.matchedBy.equals(user._id)) {
        matchedUserId = isMatchExists.matchedTo;
      } else if (isMatchExists.matchedTo.equals(user._id)) {
        matchedUserId = isMatchExists.matchedBy;
      }

      const matchedUser = await User.findById(matchedUserId);

      return { ...user._doc, matchedUser: matchedUser };
    } else {
      return user;
    }
  } catch (e) {
    throw e;
  }
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  try {
    const refreshTokenDoc = await Token.findOne({
      token: refreshToken,
      type: tokenTypes.REFRESH,
      blacklisted: false,
    });
    if (!refreshTokenDoc) throw new Error();
    return refreshTokenDoc.deleteOne();
  } catch (e) {
    return false;
  }
};

/**
 * Reset password
 * @param resetPasswordTokenDoc
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (userId, newPassword) => {
  try {
    // Fetch User
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    // Update User Password
    await userService.update(user, { password: newPassword });

    // Delete all reset password OTPs for this user (To remove redundant documents)
    await OTP.deleteMany({ userId: user._id, type: otpTypes.RESET_PASSWORD });
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  login,
  logout,
  resetPassword,
};
