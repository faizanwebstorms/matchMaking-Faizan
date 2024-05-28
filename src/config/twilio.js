const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    TWILIO_SID: Joi.string(),
    TWILIO_AUTH_TOKEN: Joi.string(),
    TWILIO_MESSAGING_SID: Joi.string(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

module.exports = {
  SID: envVars.TWILIO_SID,
  AUTH_TOKEN: envVars.TWILIO_AUTH_TOKEN,
  messagingSID: envVars.TWILIO_MESSAGING_SID,
};
