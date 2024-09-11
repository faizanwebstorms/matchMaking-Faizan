const mongoose = require('mongoose');
const { phone } = require('phone');
const { otpTypesEnum, otpStatusesEnum, otpStatuses } = require('../config/otp');

/**
 * OTP model schema
 * To store Reset Password and Verify Phone OTPs
 */

const otpSchema = mongoose.Schema(
  {
    otp: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    phoneNumber: String,
    type: {
      type: String,
      enum: otpTypesEnum,
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    status: {
      type: Number,
      enum: otpStatusesEnum,
      default: otpStatuses.PENDING,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

otpSchema.set('toObject', { virtuals: true, versionKey: false });
otpSchema.set('toJSON', { virtuals: true, versionKey: false });

otpSchema.pre('save', async function (next) {
  const otp = this;
  if (otp.isModified('phoneNumber')) {
    const phoneNo = phone(otp.phoneNumber);
    otp.phoneNumber = phoneNo.phoneNumber;
  }
  next();
});

/**
 * @typedef User
 */
module.exports = mongoose.model('OTP', otpSchema);
