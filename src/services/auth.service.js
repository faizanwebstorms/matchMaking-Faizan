const tokenService = require("./token.service");
const userService = require("./user.service");
const { Token, OTP, User, UserPreference } = require("../models");
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

    //Get matchewd user
    
    const preference = await UserPreference.findOne({userId:user?.id});
    if(preference){
      const mostMatchedPreference = await userService.findMostMatchedPreference(preference ,user?.unMatchedUsers );    
      const matchedUser = await User.findById(mostMatchedPreference?.userId);
      return {...user._doc , matchedUser:matchedUser};
    }
   else{
    return user ;
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

module.exports = {
  login,
  logout,
};
