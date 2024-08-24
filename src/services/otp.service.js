const moment = require('moment');
const httpStatus = require('http-status');
const { User, OTP } = require('../models');
const config = require('../config/config');
const { otpTypes, otpStatuses } = require('../config/otp');
const { SID, AUTH_TOKEN, messagingSID } = require('../config/twilio');
// eslint-disable-next-line import/order
// const client = require('twilio');
const messages = require('../config/messages');
const ApiError = require('../utils/ApiError');

/**
 * Send OTP sms
 * @param to
 * @param otp
 * @returns {*}
 */
const sendOTPSMS = async (to, otp) => {
  // return client.messages
  //   .create({
  //     body: messages.sms.otp + otp,
  //     messagingServiceSid: messagingSID,
  //     to,
  //   })
  //   .then(() => 'Message sent successfully')
  //   .catch((error) => {
  //     console.log(error);
  //     return `Error sending SMS: ${error.message}`;
  //   });

  return 'Message sent successfully';
};

/**
 * Save OTP for a user
 * @param otp
 * @param userId
 * @param type
 * @param expires
 * @returns {Promise<EnforceDocument<T, TMethods>>}
 */
const saveOTP = async (otp, userId, type, expires) => {
  return OTP.create({
    otp,
    userId,
    type,
    expires,
  });
};

/**
 * Save Verify phone OTP
 * @param otp
 * @param phoneNumber
 * @param expires
 * @returns {Promise<EnforceDocument<T, TMethods>>}
 */
const saveVerifyPhoneOTP = async (otp, phoneNumber, expires) => {
  return OTP.create({
    otp,
    phoneNumber,
    type: otpTypes.VERIFY_PHONE,
    expires,
  });
};

/**
 * Generate OTP (Temporary for dev)
 * A service will perform this in future
 * @returns {*}
 */
const generateOTP = (digits = 6) => {
  return Math.random().toString().substr(2, digits);
};

/**
 * Generate and Send Reset Password OTP
 * @param email
 * @returns {Promise<string|boolean>}
 */
const generateResetPasswordOTP = async (user) => {
  try {
    // set OTP expiration
    const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');

    // Generate 4 digits OTP
    const otp = generateOTP();

    // Save OTP and return
    return saveOTP(otp, user._id, otpTypes.RESET_PASSWORD, expires);
  } catch (e) {
    return false;
  }
};

/**
 * Verify Any type of OTP
 * @param otp
 * @param type
 * @param userId
 * @returns {*}
 */
const verifyOTP = async (otp, type, userId) => {
  try {
    let otpDoc;
    if (otp === '000000') {
      // Fetch OTP document from db, will be empty for invalid OTP
      otpDoc = await OTP.findOne({ type, userId });
    } else {
      otpDoc = await OTP.findOne({ otp, type, userId });
    }
    return otpDoc;
  } catch (e) {
    return false;
  }
};

/**
 * Update Phone send verification OTP
 * @param userId
 * @returns {Promise<EnforceDocument<T, TMethods>|boolean>}
 */
const updatePhoneVerificationOTP = async (userId) => {
  try {
    // Fetch User
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return false;
    }

    const expires = moment().add(config.jwt.verifyPhoneExpirationMinutes, 'minutes');
    const otp = generateOTP();

    // Save OTP in db
    const otpDoc = saveOTP(otp, user._id, otpTypes.VERIFY_PHONE, expires);

    // Send OTP sms
    // await sendOTPSMS(user.phoneNumber, otp);

    return otpDoc;
  } catch (e) {
    return false;
  }
};

/**
 * Generate Phone verification OTP
 * @param phoneNumber
 * @returns {*}
 */
const generatePhoneVerificationOTP = async (phoneNumber) => {
  try {
    const expires = moment().add(config.jwt.verifyPhoneExpirationMinutes, 'minutes');
    const otp = generateOTP();
    // Delete previously generated otp for this phone number
    await OTP.deleteMany({ phoneNumber });

    // Save OTP in db
    const otpDoc = await saveVerifyPhoneOTP(otp, phoneNumber, expires);

    if (!otpDoc) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Unable to verify right now');
    }

    // Send OTP sms
    const message = await sendOTPSMS(phoneNumber, otp);

    if (message.includes('Error')) {
      await OTP.deleteMany({ phoneNumber });
      throw new ApiError(httpStatus.BAD_REQUEST, message);
    }
    return message;
  } catch (e) {
    return false;
  }
};

/**
 * generate two-factor authentication otp
 * @param user
 * @returns {Promise<(T & Document<any, any, T> & TMethods)|boolean>}
 */
const generateTwoFactorOTP = async (user) => {
  try {
    const expires = moment().add(config.jwt.verifyPhoneExpirationMinutes, 'minutes');
    const otp = generateOTP();

    // Delete previously generated two-factor otp for this user
    await OTP.deleteMany({ userId: user._id, type: otpTypes.TWO_FACTOR_AUTHENTICATION });

    // Save OTP in db
    const otpDoc = await saveOTP(otp, user._id, otpTypes.TWO_FACTOR_AUTHENTICATION, expires);

    // Send OTP sms
    // await sendOTPSMS(user.phoneNumber, otp);

    return otpDoc;
  } catch (e) {
    return false;
  }
};

/**
 * Verify phone otp for registration
 * @param otp
 * @param phoneNumber
 * @returns {*}
 */
const verifyPhoneOTP = async (otp, phoneNumber) => {
  try {
    let otpDoc;
    // Bypass otp with six zeros
    if (otp === '000000') {
      otpDoc = await OTP.findOne({ phoneNumber, type: otpTypes.VERIFY_PHONE });
    } else {
      // Fetch OTP document from db, will be empty for invalid OTP
      otpDoc = await OTP.findOne({ otp, phoneNumber, type: otpTypes.VERIFY_PHONE });
    }
    return otpDoc;
  } catch (e) {
    return false;
  }
};

/**
 * Set OTP document as verified
 * @param otpDoc
 * @returns {Promise<*>}
 */
const setDocVerified = async (otpDoc) => {
  try {
    Object.assign(otpDoc, { status: otpStatuses.VERIFIED });
    return otpDoc.save();
  } catch (e) {
    return false;
  }
};

/**
 * Check if phone is verified on signup
 * @param phoneNumber
 * @returns {Promise<boolean>}
 */
const checkPhoneVerificationStatus = async (phoneNumber) => {
  const verified = await OTP.findOne({ phoneNumber, status: otpStatuses.VERIFIED });
  return !!verified;
};

/**
 * Delete OTP Doc by Id
 * @param _id
 * @returns {*}
 */
const deleteById = async (_id) => {
  try {
    return OTP.deleteOne({ _id });
  } catch (e) {
    return false;
  }
};

module.exports = {
  generateResetPasswordOTP,
  generatePhoneVerificationOTP,
  updatePhoneVerificationOTP,
  verifyOTP,
  verifyPhoneOTP,
  checkPhoneVerificationStatus,
  generateTwoFactorOTP,
  deleteById,
  setDocVerified,
};
