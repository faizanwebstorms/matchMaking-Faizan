const nodemailer = require('nodemailer');
const ejs = require('ejs');
const config = require('../config/config');
const logger = require('../config/logger');

/**
 * Email server Configuration
 */

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, text };
  await transport.sendMail(msg);
};
const emailSend = async (to, subject, data) => {
  const msg = { from: config.email.from, to, subject, html: data };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (user) => {
  ejs.renderFile(
    `${__dirname}/../templates/resetpassword.ejs`,
    { receiver: user.username, content: user.email },
    async (err, data) => {
      if (err) {
        console.log('Error', err);
      } else {
        const subject = 'Change Password';
        await emailSend(user.email, subject, data);
      }
    }
  );
};

const changePasswordEmail = async (to, otp) => {
  ejs.renderFile(`${__dirname}/../templates/changePassword.ejs`, { otp }, async (err, data) => {
    if (err) {
      console.log('Error', err);
    } else {
      const subject = 'Forgot Password';
      await emailSend(to, subject, data);
    }
  });
};



/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  changePasswordEmail,
};
