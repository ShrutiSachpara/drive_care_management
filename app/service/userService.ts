import * as bcrypt from 'bcrypt';
import { message } from '../utils/message';
import { StatusCodes } from 'http-status-codes';
import { generateToken } from '../helper/auth';
import { RESPONSE_STATUS } from '../utils/enum';
import { User } from '../model/user';
import { DbService } from '../helper/serviceLayer';
import { asyncHandler } from '../helper/error';
import { handleResponse } from '../helper/response';
import { logger } from '../logger/logger';
import { Request, Response } from 'express';
const saltRounds = 10;

interface CustomRequest extends Request {
  user: {
    id: number;
  };
}

export const register = asyncHandler(async (req, res) => {
  const { email_id, password } = req.body;
  const findUser = await DbService.findOne(User, { email_id });

  if (findUser) {
    logger.error(`User ${message.ALREADY_REGISTERED}`);
    handleResponse({
      res,
      code: StatusCodes.BAD_REQUEST,
      status: RESPONSE_STATUS.ERROR,
      message: `User ${message.ALREADY_REGISTERED}`,
    });
  }

  const updateData = { ...req.body };

  if (req.file) {
    updateData.profile_image = req.file.filename;
  }

  updateData.password = await bcrypt.hash(password, saltRounds);

  await DbService.create(User, updateData);

  logger.info(message.REGISTERED_SUCCESS);
  handleResponse({
    res,
    code: StatusCodes.CREATED,
    status: RESPONSE_STATUS.SUCCESS,
    message: message.REGISTERED_SUCCESS,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email_id, password } = req.body;

  const findUser = await DbService.findOne(User, {
    email_id,
    is_deleted: false,
  });

  if (!findUser) {
    logger.error(message.USER_NOT_FOUND);
    handleResponse({
      res,
      code: StatusCodes.NOT_FOUND,
      status: RESPONSE_STATUS.ERROR,
      message: message.USER_NOT_FOUND,
    });
  }

  const comparePassword = await bcrypt.compare(password, findUser.password);

  if (comparePassword) {
    const tokenObj = {
      id: findUser.id,
      role: findUser.role,
      name: findUser.name,
    };

    const token = generateToken(tokenObj);

    logger.info(message.LOGIN_SUCCESS);
    handleResponse({
      res,
      code: StatusCodes.OK,
      status: RESPONSE_STATUS.SUCCESS,
      data: token,
      message: message.LOGIN_SUCCESS,
    });
  } else {
    logger.error(message.DOES_NOT_MATCH);
    handleResponse({
      res,
      code: StatusCodes.BAD_REQUEST,
      status: RESPONSE_STATUS.ERROR,
      message: message.DOES_NOT_MATCH,
    });
  }
});

export const viewProfile = asyncHandler(
  async (req: Request | CustomRequest, res: Response) => {
    const customReq = req as CustomRequest;
    const userId: number = customReq.user.id;

    const userData = await DbService.findOne(
      User,
      { id: userId, is_deleted: false },
      {
        exclude: [
          'password',
          'created_at',
          'updated_at',
          'is_active',
          'is_deleted',
        ],
      },
    );
    if (userData) {
      logger.info(`User profile ${message.GET_SUCCESS}`);
      handleResponse({
        res,
        code: StatusCodes.OK,
        status: RESPONSE_STATUS.SUCCESS,
        data: userData,
      });
    } else {
      logger.error(`User ${message.NOT_FOUND}`);
      handleResponse({
        res,
        code: StatusCodes.NOT_FOUND,
        status: RESPONSE_STATUS.ERROR,
        message: `User ${message.NOT_FOUND}`,
      });
    }
  },
);

export const updateProfile = asyncHandler(
  async (req: Request | CustomRequest, res: Response) => {
    const customReq = req as CustomRequest;
    const userId: number = customReq.user.id;

    const existingUser = await DbService.findOne(User, {
      id: userId,
      is_deleted: false,
    });

    if (!existingUser) {
      logger.error(`${message.FAILED_TO} find user.`);
      handleResponse({
        res,
        code: StatusCodes.NOT_FOUND,
        status: RESPONSE_STATUS.ERROR,
        message: `${message.FAILED_TO} find user.`,
      });
    }

    const updateData = { ...req.body };

    if (req.file) {
      updateData.profile_image = req.file.filename;
    }

    const [updatedProfile] = await DbService.update(
      User,
      { id: userId, is_deleted: false },
      updateData,
    );

    if (updatedProfile === 1) {
      logger.info(`Your profile is ${message.UPDATE_SUCCESS}`);
      handleResponse({
        res,
        code: StatusCodes.ACCEPTED,
        status: RESPONSE_STATUS.SUCCESS,
        message: `Your profile is ${message.UPDATE_SUCCESS}`,
      });
    } else {
      logger.error(`${message.FAILED_TO} update profile`);
      handleResponse({
        res,
        code: StatusCodes.BAD_REQUEST,
        status: RESPONSE_STATUS.ERROR,
        message: `${message.FAILED_TO} update profile`,
      });
    }
  },
);
