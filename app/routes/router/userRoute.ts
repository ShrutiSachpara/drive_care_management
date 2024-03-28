import express from 'express';
import { upload } from '../../helper/multer';
import {
  registerController,
  loginController,
  viewProfileController,
  updateProfileController,
  changePasswordController,
  verifyEmailController,
  updatePasswordController,
} from '../../controller/userController';
import { validator } from '../../helper/validator';
import { authorization } from '../../helper/auth';
import { ROLE } from '../../utils/enum';
import {
  editProfileValidation,
  loginValidation,
  registerValidation,
  resetPasswordValidation,
  updatePasswordValidation,
  verifyEmailValidation,
} from '../../validation/userValidation';

const userRouter = express.Router();

userRouter.post(
  '/registration',
  upload.single('profile_image'),
  validator.body(registerValidation),
  registerController,
);

userRouter.post('/login', validator.body(loginValidation), loginController);

userRouter.get(
  '/viewProfile',
  authorization([ROLE.ADMIN, ROLE.CUSTOMER, ROLE.MANAGER, ROLE.MECHANIC]),
  viewProfileController,
);

userRouter.put(
  '/editProfile',
  authorization([ROLE.CUSTOMER, ROLE.MANAGER, ROLE.MECHANIC]),
  upload.single('profile_image'),
  validator.body(editProfileValidation),
  updateProfileController,
);

userRouter.put(
  '/changePassword',
  authorization([ROLE.CUSTOMER, ROLE.MANAGER, ROLE.MECHANIC]),
  validator.body(resetPasswordValidation),
  changePasswordController,
);

userRouter.post(
  '/verifyEmail',
  validator.body(verifyEmailValidation),
  verifyEmailController,
);

userRouter.post(
  '/updatePassword',
  validator.body(updatePasswordValidation),
  updatePasswordController,
);

export default userRouter;
