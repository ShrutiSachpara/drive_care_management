import { GeneralError } from '../utils/error';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../logger/logger';
import { NextFunction, Request, Response } from 'express';
import { handleError } from './response';
import { RESPONSE_STATUS } from '../utils/enum';

const statusToSet = 400;

interface JoiError {
  error: {
    isJoi: boolean;
    details: {
      context: { key: string; label: string };
      message: string;
      type: string;
    }[];
  };
}

interface ErrorDetail {
  message: string;
  context: string;
  type: string;
}

interface CustomError {
  original?: { sqlMessage: string };
}

export const handleErrors = (
  err: Error | GeneralError,
  req: Request,
  res: Response,
) => {
  if (err instanceof GeneralError) {
    return res
      .status(
        typeof err.statusCode === 'string'
          ? parseInt(err.statusCode, 10)
          : err.statusCode || err.getCode(),
      )
      .json({
        status: err.status,
        code: err.statusCode !== '' ? err.statusCode : err.getCode(),
        message: err.message,
        result: err.data !== '' ? err.data : undefined,
      });
  }

  logger.info(err.message);
  handleError({
    res,
    code: StatusCodes.INTERNAL_SERVER_ERROR,
    status: RESPONSE_STATUS.ERROR,
    data: undefined,
    message: err.message,
  });
};

export const handleJoiErrors = (
  err: JoiError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err && err.error && err.error.isJoi) {
    logger.error(err.error);
    const customErrorResponse: Record<string, ErrorDetail> = {};
    if (err.error.details.length !== 0) {
      err.error.details.forEach((item) => {
        customErrorResponse[`${item.context.key}`] = {
          message: item.message,
          context: item.context.label,
          type: item.type,
        };
      });
    }

    res.status(statusToSet).json({
      status: 'error',
      code: StatusCodes.BAD_REQUEST,
      message: 'Validation Error',
      data: customErrorResponse,
    });
  } else {
    next(err);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const errorHandler = (err: any, res: Response) => {
  if (isCustomError(err)) {
    if (err.original?.sqlMessage) {
      return res.status(500).json({ error: err.original.sqlMessage });
    }
  }
  return res
    .status(500)
    .json({ error: err.message || 'Internal Server Error' });
};

export const asyncHandler = (
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (err) {
      errorHandler(err, res);
    }
  };
};

function isCustomError(err: unknown): err is CustomError {
  return (err as CustomError)?.original?.sqlMessage !== undefined;
}
