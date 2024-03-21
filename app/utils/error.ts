import { StatusCodes } from 'http-status-codes';
import { logger } from '../logger/logger';

export class GeneralError<T = unknown> extends Error {
  message: string;
  statusCode: string | number;
  data: T | undefined;
  status: string;
  result: unknown;

  constructor(
    message: string,
    statusCode: string | number = '',
    data: T | undefined = undefined,
    status: string,
  ) {
    logger.info(message);
    super();
    this.message = message;
    this.statusCode = statusCode ? statusCode : 500;
    this.data = data ? data : undefined;
    this.status = status;
  }
  getCode() {
    if (this instanceof BadRequest) {
      return StatusCodes.BAD_REQUEST;
    } else if (this instanceof NotFound) {
      return StatusCodes.NOT_FOUND;
    } else if (this instanceof UnAuthorized) {
      return StatusCodes.UNAUTHORIZED;
    } else if (this instanceof ServiceNotAvailable) {
      return StatusCodes.INTERNAL_SERVER_ERROR;
    }
    return StatusCodes.INTERNAL_SERVER_ERROR;
  }
}

export class BadRequest extends GeneralError {}
export class NotFound extends GeneralError {}
export class UnAuthorized extends GeneralError {}
export class ServiceNotAvailable extends GeneralError {}
