const objectId = (value, helpers) => {
  if (value && !value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid id');
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('Password must be at least 8 characters');
  }
  if (!value.match(/\d/) || !value.match(/[A-Z]/)) {
    return helpers.message('Password must contain at least 1 Uppercase letter and 1 number');
  }
  // if (!value.match(/[_@./#&+-]/)) {
  //   return helpers.message('Password must contain at least 1 special character');
  // }
  return value;
};

const uri = (value, helpers) => {
  // eslint-disable-next-line security/detect-unsafe-regex
  if (value && !value.match(/((?:(?:http?|ftp)[s]*:\/\/)?[a-z0-9-%/&=?.]+\.[a-z]{2,4}\/?([^\s<>#%",{}\\|\\^[\]`]+)?)/)) {
    return helpers.message('Invalid link format');
  }
  return value;
};

const alphabets = (value, helpers) => {
  // eslint-disable-next-line security/detect-unsafe-regex
  if (value && !value.match(/^[a-zA-Z ]+$/)) {
    return helpers.message('"{{#label}}" should only contain alphabets');
  }
  return value;
};

const numeric = (value, helpers) => {
  // eslint-disable-next-line security/detect-unsafe-regex
  if (value && !value.match(/^\d+$/)) {
    return helpers.message('OTP should only contain numbers');
  }
  return value;
};

const username = (value, helpers) => {
  if (value.length < 6 || value.length > 30) {
    return helpers.message('Username should contain 6 to 30 characters');
  }

  if (value && !value.match(/^[A-Za-z][A-Za-z0-9]*(?:_+[A-Za-z0-9]+)*$/)) {
    return helpers.message(
      'Username should only contain alphanumeric characters and underscores. First character must be an alphabetic character.'
    );
  }
  return value;
};

const phoneNumber = (value, helpers) => {
  // eslint-disable-next-line security/detect-unsafe-regex
  if (value && !value.match(/^(?:(?:00|\+)\d{2}|0)[1-9](?:\d{8})$/)) {
    return helpers.message('"{{#label}}" format is invalid');
  }
  return value;
};

const mediaType = (value, helpers) => {
  if (value && (value != '1' && value != '2')) {
    return helpers.message('Invalid media type, select 1 for image or 2 for video');
  }
  return value;
};

/**
 * Unique validation
 * @param value
 * @param helpers
 * @returns {*}
 */
const arrayUnique = (value, helpers) => {
  if (value && value.some((val, i) => value.indexOf(val) !== i)) {
    return helpers.message('Duplicate {{#label}} are not allowed');
  }
  return value;
};

const timeFormat = (value, helpers) => {
  if (value && !value.match(/^([1-9]|0[1-9]|1[0-2]):[0-5][0-9] ([AP][M])$/)) {
    return helpers.message('{{#label}} time format should be hh:mm AM/PM');
  }
  return value;
};

module.exports = {
  objectId,
  password,
  uri,
  alphabets,
  numeric,
  username,
  phoneNumber,
  mediaType,
  arrayUnique,
  timeFormat,
};
