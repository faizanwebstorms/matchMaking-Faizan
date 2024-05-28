const tokenService = require("./token.service");
const userService = require("./user.service");
const { Token, OTP, User } = require("../models");
const { tokenTypes } = require("../config/tokens");
const { otpTypes } = require("../config/otp");

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
      throw new Error();
    }
    return user.toObject();
  } catch (e) {
    return false;
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

module.exports = {
  login,
  logout,
};
