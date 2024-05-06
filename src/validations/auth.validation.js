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


module.exports = {
  register,
  login,
  loginSocial,
  logout,
  checkEmail,
  checkUserName,

};
