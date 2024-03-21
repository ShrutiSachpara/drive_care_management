import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { RESPONSE_STATUS } from '../utils/enum';
import { message } from '../utils/message';
import { Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../logger/logger';
import { GeneralError } from '../utils/error';

interface JwtPayload {
  id: string;
  role: string;
}

export const generateToken = (data: { id: string; role: string }): string => {
  return jwt.sign({ id: data.id, role: data.role }, '123', {
    expiresIn: '365d',
  });
};

export const authorization = (roles: string[] = []) => {
  return (
    req: { header: (arg: string) => string | null; user?: JwtPayload },
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const token: string = req.header('Authorization')!;
      if (!token) {
        logger.error(message.AUTH_MISSING);
        next(
          new GeneralError(
            message.AUTH_MISSING,
            StatusCodes.OK,
            undefined,
            RESPONSE_STATUS.ERROR,
          ),
        );
      }

      const verified: JwtPayload = jwt.verify(token, '123') as JwtPayload;
      req.user = verified;
      if (roles.length > 0 && roles.some((role) => role === verified.role)) {
        next();
      } else {
        logger.error(message.ACCESS_REQUIRED);
        next(
          new GeneralError(
            message.ACCESS_REQUIRED,
            StatusCodes.UNAUTHORIZED,
            undefined,
            RESPONSE_STATUS.ERROR,
          ),
        );
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
        errorResponse = `${message.REQUEST_FAILURE} authorization.`;
        break;
      }

      logger.error(errorResponse);
      next(
        new GeneralError(
          errorResponse,
          StatusCodes.UNAUTHORIZED,
          undefined,
          RESPONSE_STATUS.ERROR,
        ),
      );
    }
  };
};
