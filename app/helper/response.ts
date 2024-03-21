import { GeneralResponse } from '../utils/response';
import { StatusCodes } from 'http-status-codes';
import { NextFunction, Response } from 'express';

export const handleResponse = (
  response: Response,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (response instanceof GeneralResponse) {
    return res.status(StatusCodes.OK).json({
      status: response.status,
      code: response.statusCode,
      message: response.message,
      data: response.data,
    });
  }
  next(response);
};
