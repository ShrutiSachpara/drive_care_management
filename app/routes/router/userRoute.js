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

router.post(
  '/registration',
  upload.single('profile_image'),
  validator.body(registerValidation),
  registerController,
);

router.post('/login', validator.body(loginValidation), loginController);

router.get('/viewProfile', authenticateJWT, viewProfileController);

router.put(
  '/editProfile',
  authenticateJWT,
  upload.single('profile_image'),
  validator.body(editProfileValidation),
  updateProfileController,
);

module.exports = router;
