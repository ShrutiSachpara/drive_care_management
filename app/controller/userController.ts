import { Request, Response, NextFunction } from 'express';
import {
  register,
  login,
  viewProfile,
  updateProfile,
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
