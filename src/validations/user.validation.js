const Joi = require('joi');
const { password, alphabets, username, phoneNumber, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    firstName: Joi.string().required().custom(alphabets),
    lastName: Joi.string().required().custom(alphabets),
    roleId: Joi.string().required(),
    username: Joi.string().required().custom(username),
    phone_number: Joi.string().required().custom(phoneNumber),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string().custom(alphabets),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string(),
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

const updateProfile = {
  body: Joi.object()
    .keys({
      firstName: Joi.string().custom(alphabets),
      lastName: Joi.string().custom(alphabets),
      username: Joi.string().custom(username),
      bio: Joi.string().allow(''),
      country: Joi.string().allow(''),
      isLocation: Joi.boolean(),
      dateOfBirth: Joi.date().allow('').max('now'),
      profileBanner: Joi.string().allow(''),
      profileImage: Joi.string().allow(''),
      gender: Joi.string().allow(''),
      pronouns: Joi.string().allow(''),
      socials: Joi.object().keys({
        instagram: Joi.string().trim().allow(''),
        facebook: Joi.string().trim().allow(''),
        twitter: Joi.string().trim().allow(''),
      }),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string(),
  }),
};

const getUserByContacts = {
  body: Joi.object().keys({
    phone_numbers: Joi.array().required(),
  }),
};

const verifyPassword = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const updatePhone = {
  body: Joi.object().keys({
    phoneNumber: Joi.string().required().custom(phoneNumber),
  }),
};

const verifyPhone = {
  body: Joi.object().keys({
    otp: Joi.string().required(),
  }),
};

const updateDetail = {
  params: Joi.object().keys({
    userId: Joi.required(),
  }),
  body: Joi.object().keys({
    bio: Joi.string().allow(''),
    country: Joi.string().allow(''),
    dateOfBirth: Joi.date().allow('').max('now'),
    profileBanner: Joi.string().allow(''),
    profileImage: Joi.string().allow(''),
    gender: Joi.string().allow(''),
    pronouns: Joi.string().allow(''),
  }),
};

const removeFollow = {
  params: Joi.object().keys({
    removeUserId: Joi.string().required(),
  }),
};

const followUser = {
  body: Joi.object().keys({
    followToUserId: Joi.string().required(),
  }),
};

const getProfile = {
  query: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserByContacts,
  verifyPassword,
  verifyPhone,
  updatePhone,
  updateDetail,
  removeFollow,
  followUser,
  updateProfile,
  getProfile,
};
