const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
// const userHelper = require('../utils/user.helper');

// Middleware to check for authentication

const verifyCallback = (req, resolve, reject, requiredRight, resource) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = user;
  if (requiredRight && resource) {
    // const roles = await userHelper.getRoles(user._id);
    // if (!roles.includes('admin')) {
    //   const permission = userHelper.hasPermission(roles, resource, requiredRight);
    //   if (!permission.granted) {
    //     return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    //   }
    // }
  }
  resolve();
};

const auth = (requiredRight, resource) => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRight, resource))(
      req,
      res,
      next
    );
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = auth;
