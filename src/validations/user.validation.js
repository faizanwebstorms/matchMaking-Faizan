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
const updateUser = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      firstName: Joi.string().allow('').custom(alphabets),
      lastName: Joi.string().allow('').custom(alphabets),
      age: Joi.number().allow(''),
      height: Joi.number().allow(''),
      weight: Joi.number().allow(''),
      city: Joi.string().allow('').custom(alphabets),
      postalCode:Joi.string().allow(''),
      gender: Joi.number().allow(''),
      religion:Joi.number().allow(''),
      relationshipIntention:Joi.number().allow(''),
    })
};
const createPreference = {
  body: Joi.object()
    .keys({
      genderPreference: Joi.number().required(),
      agePreference:Joi.number().required(),
      heightPreference:Joi.number().required(),
      bmiPreference: Joi.number().required(),
      religionPreference:Joi.number().required(),
      locationPreference:Joi.number().required(),
      relationshipIntention:Joi.number().required(),
    })
};
const updatePreference = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      genderPreference: Joi.number().allow(''),
      agePreference:Joi.number().allow(''),
      heightPreference:Joi.number().allow(''),
      bmiPreference: Joi.number().allow(''),
      religionPreference:Joi.number().allow(''),
      locationPreference:Joi.number().allow(''),
      relationshipIntention:Joi.number().allow(''),
    })
};
const questionnaireResponse = {
  body: Joi.object()
    .keys({
      educationProfession: Joi.string().allow(''),
      hobbiesPassions:Joi.string().allow(''),
      kidsPets:Joi.string().allow(''),
      greenFlags: Joi.string().allow(''),
      redFlags:Joi.string().allow(''),
      valuesPersonality:Joi.string().allow(''),
    })
};

module.exports = {
  createUser,
  updateUser,
  updatePreference,
  createPreference,
  questionnaireResponse

};
