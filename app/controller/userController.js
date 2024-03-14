const {
  register,
  login,
  viewProfile,
  updateProfile,
} = require('../service/userService');

module.exports = {
  registerController: (req, res, next) => {
    return register(req, next);
  },

  loginController: (req, res, next) => {
    return login(req, next);
  },

  viewProfileController: (req, res, next) => {
    return viewProfile(req, next);
  },

  updateProfileController: async (req, res, next) => {
    return updateProfile(req, next);
  },
};
