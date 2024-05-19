const Joi = require('joi');
const { password, alphabets, numeric, username, phoneNumber } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
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
const updateUser = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      firstName: Joi.string().allow('').custom(alphabets),
      lastName: Joi.string().allow('').custom(alphabets),
      phone_number: Joi.string(),
    })
    .min(1),
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
