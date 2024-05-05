const Joi = require('joi');
const { password, alphabets, numeric, username, phoneNumber } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    firstName: Joi.string().required().custom(alphabets),
    lastName: Joi.string().required().custom(alphabets),
    username: Joi.string().required().custom(username),
    phoneNumber: Joi.string().custom(phoneNumber),
    user_preferences:Joi.array().items(Joi.string().allow('')).allow('')
  }),
};

const loginSocial = {
  body: Joi.object().keys({
    email: Joi.string().required().email().required(),
    firstName: Joi.string().custom(alphabets),
    lastName: Joi.string().custom(alphabets),
    type: Joi.number().valid(1, 2, 3).required(),
    profileImage: Joi.string().allow(''),
    token: Joi.string().required(),
    facebookId: Joi.string(),
    googleId: Joi.string(), // for future implementation check ID token in case of google
    appleId: Joi.string(), // for future implementation
    phoneNumber: Joi.string().custom(phoneNumber),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
  }),
};

const verifyResetPasswordOTP = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
    otp: Joi.string().length(6).custom(numeric).required().messages({
      'string.empty': 'OTP cannot be empty',
      'any.required': 'OTP is required and cannot be empty',
      'string.length': 'OTP length should be six digits',
    }),
  }),
};

const resetPassword = {
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
    userId: Joi.string().required(),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const checkEmail = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
  }),
};

const checkUserName = {
  body: Joi.object().keys({
    username: Joi.string().required().custom(username),
  }),
};

const sendPhoneOTP = {
  params: Joi.object().keys({
    phoneNumber: Joi.string().required().custom(phoneNumber),
  }),
};

const verifyOTP = {
  body: Joi.object().keys({
    phoneNumber: Joi.string().required().custom(phoneNumber),
    otp: Joi.string().length(6).custom(numeric).required().messages({
      'string.empty': 'OTP cannot be empty',
      'any.required': 'OTP is required and cannot be empty',
      'string.length': 'OTP length should be six digits',
    }),
  }),
};

const verifyTFACode = {
  body: Joi.object().keys({
    otp: Joi.string().length(6).custom(numeric).required().messages({
      'string.empty': 'OTP cannot be empty',
      'any.required': 'OTP is required and cannot be empty',
      'string.length': 'OTP length should be six digits',
    }),
  }),
};

module.exports = {
  register,
  login,
  loginSocial,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  checkEmail,
  checkUserName,
  sendPhoneOTP,
  verifyOTP,
  verifyTFACode,
  verifyResetPasswordOTP,
};
