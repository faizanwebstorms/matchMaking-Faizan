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
    userId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email().allow(''),
      firstName: Joi.string().allow('').custom(alphabets),
      lastName: Joi.string().allow('').custom(alphabets),
      age: Joi.number().allow(''),
      height: Joi.number().allow(''),
      weight: Joi.number().allow(''),
      postalCode:Joi.string().allow(''),
      gender: Joi.number().allow('').valid(0 ,1 ,2),
      religion:Joi.number().allow('').valid(0, 1, 2 ,3 ,4),
      relationshipIntention:Joi.number().allow(''),
      location: Joi.object().keys({
        name: Joi.string().allow(''),
        latitude: Joi.number().allow(''),
        longitude: Joi.number().allow(''),
        latitudeDelta: Joi.number().allow(''),
        longitudeDelta: Joi.number().allow(''),
      }),
    })
};
const createPreference = {
  body: Joi.object()
    .keys({
      genderPreference: Joi.number().required().valid(0, 1, 2),
      agePreference:Joi.number().required().valid(0, 1, 2, 3),
      heightPreference:Joi.number().required().valid(0, 1, 2, 3),
      bmiPreference: Joi.number().required(),
      religionPreference:Joi.number().required().valid(0, 1),
      locationPreference:Joi.number().required().valid(0, 1, 2, 3),
      relationshipIntention:Joi.number().required().valid(0, 1, 2, 3),
    })
};
const updatePreference = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      genderPreference: Joi.number().allow('').valid(0, 1, 2),
      agePreference:Joi.number().allow('').valid(0, 1, 2, 3),
      heightPreference:Joi.number().allow('').valid(0, 1, 2, 3),
      bmiPreference: Joi.number().allow(''),
      religionPreference:Joi.number().allow('').valid(0, 1),
      locationPreference:Joi.number().allow('').valid(0, 1, 2, 3),
      relationshipIntention:Joi.number().allow('').valid(0, 1, 2, 3),
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
