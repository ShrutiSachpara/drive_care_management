import { Request, Response, NextFunction } from 'express';
import {
  register,
  login,
  viewProfile,
  updateProfile,
  changePassword,
  updatePassword,
  verifyEmail,
} from '../service/userService';

export const registerController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  return register(req, res, next);
};

export const loginController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  return login(req, res, next);
};

export const viewProfileController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  return viewProfile(req, res, next);
};

export const updateProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  return updateProfile(req, res, next);
};

export const changePasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  return changePassword(req, res, next);
};

export const verifyEmailController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  return verifyEmail(req, res, next);
};

export const updatePasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  return updatePassword(req, res, next);
};
