import { StatusCodes } from 'http-status-codes';
import { logger } from '../logger/logger';

export class GeneralResponse {
  message: string;
  statusCode: number | string;
  data: unknown;
  status: string;

  constructor(
    message: string,
    statusCode: string | number = '',
    data: unknown,
    status: string,
  ) {
    logger.info('message', message);
    this.message = message;
    this.statusCode = statusCode === '' ? StatusCodes.OK : statusCode;
    this.data = data;
    this.status = status;
  }
}
