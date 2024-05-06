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

module.exports = {
  createUser,

};
