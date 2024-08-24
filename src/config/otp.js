const otpTypes = {
  RESET_PASSWORD: 'resetPassword',
  VERIFY_PHONE: 'verifyPhone',
  TWO_FACTOR_AUTHENTICATION: 'tf_auth',
};

const otpTypesEnum = [otpTypes.RESET_PASSWORD, otpTypes.VERIFY_PHONE, otpTypes.TWO_FACTOR_AUTHENTICATION]

const otpStatuses = {
  PENDING: 1,
  VERIFIED: 2,
};

const otpStatusesEnum = [1, 2];

module.exports = {
  otpTypes,
  otpTypesEnum,
  otpStatuses,
  otpStatusesEnum,
};
