import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { RESPONSE_STATUS } from '../utils/enum';
import { message } from '../utils/message';
import { Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../logger/logger';
import { handleResponse } from './response';

interface JwtPayload {
  id: string;
  role: string;
}

export const generateToken = (data: {
  id: string;
  role: string;
  name: string;
}): string => {
  return jwt.sign(
    {
      id: data.id,
      role: data.role,
      name: data.name,
    },
    '123',
    {
      expiresIn: '365d',
    },
  );
};

export const authorization = (roles: string[]) => {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req: any,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const token: string = req.header('Authorization')!;

      if (!token) {
        logger.error(message.AUTH_MISSING);
        handleResponse({
          res,
          status: RESPONSE_STATUS.ERROR,
          code: StatusCodes.UNAUTHORIZED,
          message: message.AUTH_MISSING,
        });
      }

      const verified: JwtPayload = jwt.verify(token, '123') as JwtPayload;
      req.user = verified;
      roles.some((role) => role === verified.role);

      if (roles.length > 0 && roles.some((role) => role === verified.role)) {
        next();
      } else {
        logger.error(message.ACCESS_REQUIRED);

        handleResponse({
          res,
          status: RESPONSE_STATUS.ERROR,
          code: StatusCodes.UNAUTHORIZED,
          message: message.ACCESS_REQUIRED,
        });
      }
    } catch (err: unknown) {
      let errorResponse;

      switch (true) {
      case err instanceof TokenExpiredError:
        errorResponse = message.TOKEN_EXPIRED;
        break;
      case err instanceof JsonWebTokenError:
        errorResponse = message.TOKEN_INVALID;
        break;
      default:
        errorResponse = `${message.FAILED_TO} authorization.`;
        break;
      }

      logger.error(errorResponse);
      handleResponse({
        res,
        status: RESPONSE_STATUS.ERROR,
        code: StatusCodes.UNAUTHORIZED,
        error: errorResponse,
      });
    }
  };
};
