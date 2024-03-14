const express = require('express');
const router = express();
const { upload } = require('../../helper/multer');
const {
  registerController,
  loginController,
  viewProfileController,
  updateProfileController,
} = require('../../controller/userController');
const { validator } = require('../../helper/validator');
const {
  registerValidation,
  loginValidation,
  editProfileValidation,
} = require('../../validation/userValidation');

const { authenticateJWT } = require('../../helper/auth');
const { ROLE } = require('../../utils/enum');

router.post(
  '/registration',
  upload.single('profile_image'),
  validator.body(registerValidation),
  registerController,
);

router.post('/login', validator.body(loginValidation), loginController);

router.get(
  '/viewProfile',
  authenticateJWT([ROLE.CUSTOMER, ROLE.MANAGER, ROLE.MECHANIC]),
  viewProfileController,
);

router.put(
  '/editProfile',
  authenticateJWT([ROLE.CUSTOMER, ROLE.MANAGER, ROLE.MECHANIC]),
  upload.single('profile_image'),
  validator.body(editProfileValidation),
  updateProfileController,
);

module.exports = router;
