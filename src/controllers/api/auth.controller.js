const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { authService, userService, tokenService, emailService, otpService } = require('../../services');
const ApiError = require('../../utils/ApiError');
const Helper = require('../../utils/Helper');
const messages = require('../../config/messages');

/**
 * Register User
 * @type {(function(*, *, *): void)|*}
 */
const register = catchAsync(async (req, res) => {

  const user = await userService.createUser(req.body);

  if (!user) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, messages.api.userStoreError);
  }



  const tokens = await tokenService.generateAuthTokens(user);

  if (!tokens) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, messages.api.internalServerError);
  }

  res.send(
    Helper.apiResponse(httpStatus.OK, messages.api.success, {
      user,
      tokens
    })
  );
});

/**
 * Social Login/Register For user (Facebook, google, Apple)
 * @type {(function(*, *, *): void)|*}
 */
const loginSocial = catchAsync(async (req, res) => {
  let user = await userService.findByClause({ email: req.body.email });

  if (!user) {
    const emailExists = await userService.checkEmailValidity(req.body.email);
    if (!emailExists) {
      throw new ApiError(httpStatus.BAD_REQUEST, messages.api.emailAlreadyExists);
    }
    // create user
    user = await userService.createSocialUser(req.body);
    if (!user) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, messages.api.userStoreError);
    }

  }

  // Check if Social ID in request matches to the one stored in DB
  if (
    (user.facebookId !== null && user.facebookId === req.facebookId) ||
    (user.googleId !== null && user.googleId === req.googleId) ||
    (user.appleId !== null && user.appleId === req.appleId)
  ) {
    // Update Token in case of a new token from Social App

    Object.assign(user, req.body);
    // await user.save();
    await tokenService.saveSocialToken(req.body, user._id, req.body.type);

    // Generate JWT Authentication Tokens in MatchMaking backend Scope
    const tokens = await tokenService.generateAuthTokens(user);
    res.send(
      Helper.apiResponse(httpStatus.OK, messages.api.success, {
        user,
        tokens,
      })
    );
  } else {
    res.status(httpStatus.BAD_REQUEST).send(Helper.apiResponse(httpStatus.BAD_REQUEST, messages.api.socialLoginError));
  }
});

/**
 * Login User
 * @type {(function(*, *, *): void)|*}
 */
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.login(email, password);

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email/username or password');
  }

  delete user.password;

  // Generate Auth Tokens
  const tokens = await tokenService.generateAuthTokens(user);
  if (!tokens) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, messages.api.internalServerError);
  }
  res.send(
    Helper.apiResponse(httpStatus.OK, messages.api.success, {
      user,
      tokens,
    })
  );
});

/**
 * Logout Request
 * @type {(function(*, *, *): void)|*}
 */
const logout = catchAsync(async (req, res) => {
  const response = await authService.logout(req.body.refreshToken);
  if (!response) {
    throw new ApiError(httpStatus.NOT_FOUND, messages.api.notFound);
  }
  res.status(httpStatus.OK).send(Helper.apiResponse(httpStatus.OK, messages.api.success));
});

module.exports = {
  register,
  loginSocial,
  login,
  logout,
}
