import express from 'express';
import { upload } from '../../helper/multer';
import {
  registerController,
  loginController,
  viewProfileController,
  updateProfileController,
} from '../../controller/userController';
import { validator } from '../../helper/validator';
import { authorization } from '../../helper/auth';
import { ROLE } from '../../utils/enum';
import {
  editProfileValidation,
  loginValidation,
  registerValidation,
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

export default userRouter;
