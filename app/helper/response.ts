import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

interface MyResponse {
  res: Response;
  code: number;
  status: string;
  data: string | undefined;
  message: string | undefined;
  error?: string | undefined;
}

export function handleResponse(response: MyResponse) {
  const { res, code, status, message, data } = response;
  return res.status(StatusCodes.OK).json({
    code,
    status,
    message,
    data,
  });
}

export function handleError(response: MyResponse) {
  const { res, message, status, data, code, error } = response;
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    code,
    status,
    message,
    data,
    error,
  });
}
