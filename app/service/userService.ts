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
import { Otp } from '../model/otp.model';
import { OtpSend } from '../helper/mail';
const saltRounds = 10;

interface CustomRequest extends Request {
  user: {
    id: number;
    role: string;
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
      data: undefined,
      message: `User ${message.ALREADY_REGISTERED}`,
    });
  }

  const updateData = { ...req.body };

  if (req.file) {
    updateData.profile_image = req.file.filename;
  }

  updateData.password = await bcrypt.hash(password, saltRounds);

  await DbService.create(User, updateData);

  logger.info(`Congratulation! You are ${message.REGISTERED_SUCCESS}`);
  handleResponse({
    res,
    code: StatusCodes.CREATED,
    status: RESPONSE_STATUS.SUCCESS,
    data: undefined,
    message: `Congratulation! You are ${message.REGISTERED_SUCCESS}`,
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
      data: undefined,
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

    logger.info(`${findUser.role} is ${message.LOGIN_SUCCESS}`);
    handleResponse({
      res,
      code: StatusCodes.OK,
      status: RESPONSE_STATUS.SUCCESS,
      data: token,
      message: `${findUser.role} is ${message.LOGIN_SUCCESS}`,
    });
  } else {
    logger.error(`Email and Password ${message.DOES_NOT_MATCH}`);
    handleResponse({
      res,
      code: StatusCodes.BAD_REQUEST,
      status: RESPONSE_STATUS.ERROR,
      data: undefined,
      message: `Email and Password ${message.DOES_NOT_MATCH}`,
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
      ['id', 'name', 'email_id', 'phone_no', 'role', 'profile_image'],
    );
    if (userData) {
      logger.info(`User profile ${message.GET_SUCCESS}`);
      handleResponse({
        res,
        code: StatusCodes.OK,
        status: RESPONSE_STATUS.SUCCESS,
        data: userData,
        message: undefined,
      });
    } else {
      logger.error(`User ${message.NOT_FOUND}`);
      handleResponse({
        res,
        code: StatusCodes.NOT_FOUND,
        status: RESPONSE_STATUS.ERROR,
        data: undefined,
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
        data: undefined,
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
        code: StatusCodes.OK,
        status: RESPONSE_STATUS.SUCCESS,
        data: undefined,
        message: `Your profile is ${message.UPDATE_SUCCESS}`,
      });
    } else {
      logger.error(`${message.FAILED_TO} update profile`);
      handleResponse({
        res,
        code: StatusCodes.BAD_REQUEST,
        status: RESPONSE_STATUS.ERROR,
        data: undefined,
        message: `${message.FAILED_TO} update profile`,
      });
    }
  },
);

export const changePassword = asyncHandler(
  async (req: Request | CustomRequest, res: Response) => {
    const customReq = req as CustomRequest;
    const userId: number = customReq.user.id;

    const { newPassword, currentPassword } = req.body;

    const findUser = await DbService.findOne(User, {
      id: userId,
      is_deleted: false,
    });

    if (findUser && Object.keys(findUser).length > 0) {
      const hashPassword = await bcrypt.compare(
        currentPassword,
        findUser.password,
      );

      if (hashPassword) {
        const updatePassword = await bcrypt.hash(newPassword, saltRounds);
        const [changedPassword] = await DbService.update(
          User,
          { id: userId },
          { password: updatePassword },
        );

        if (changedPassword === 1) {
          logger.info(`Your password is ${message.UPDATE_SUCCESS}`);
          handleResponse({
            res,
            code: StatusCodes.ACCEPTED,
            status: RESPONSE_STATUS.SUCCESS,
            message: `Your password is ${message.UPDATE_SUCCESS}`,
          });
        } else {
          logger.error(message.NOT_UPDATE_PASSWORD);
          handleResponse({
            res,
            code: StatusCodes.NOT_FOUND,
            status: RESPONSE_STATUS.ERROR,
            message: message.NOT_UPDATE_PASSWORD,
          });
        }
      } else {
        logger.error(`Your current ${message.INCORRECT_PASSWORD}`);
        handleResponse({
          res,
          code: StatusCodes.NOT_FOUND,
          status: RESPONSE_STATUS.ERROR,
          message: `Your current ${message.INCORRECT_PASSWORD}`,
        });
      }
    } else {
      logger.error(`${message.FAILED_TO} find user.`);
      handleResponse({
        res,
        code: StatusCodes.NOT_FOUND,
        status: RESPONSE_STATUS.ERROR,
        message: `${message.FAILED_TO} find user.`,
      });
    }
  },
);

export const verifyEmail = asyncHandler(async (req, res) => {
  const { email_id } = req.body;

  const findUser = await DbService.findOne(User, {
    email_id,
    is_deleted: false,
  });

  if (!findUser) {
    logger.error(`${message.FAILED_TO} find user.`);
    handleResponse({
      res,
      code: StatusCodes.NOT_FOUND,
      status: RESPONSE_STATUS.ERROR,
      message: `${message.FAILED_TO} find user.`,
    });
  } else {
    const generateOtp: number = Math.floor(Math.random() * 100000 + 1);
    await OtpSend(findUser.email_id, generateOtp);
    await DbService.create(Otp, {
      email_id: findUser.email_id,
      otp: generateOtp,
    });

    logger.info(`Otp is ${message.SEND_SUCCESS}`);
    handleResponse({
      res,
      code: StatusCodes.OK,
      status: RESPONSE_STATUS.SUCCESS,
      message: `Otp is ${message.SEND_SUCCESS}`,
      data: generateOtp,
    });
  }
});

export const updatePassword = asyncHandler(async (req, res) => {
  const { email_id, newPassword, otp } = req.body;

  console.log('req.body', req.body);

  const findOtp = await DbService.findOne(Otp, { otp, email_id });

  console.log('findOtp', findOtp);

  if (findOtp) {
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    const [updatePassword] = await DbService.update(
      User,
      { email_id },
      { password: hashedPassword },
    );

    if (updatePassword === 1) {
      await DbService.destroy(Otp, { email_id });
      logger.info(`Your password is ${message.UPDATE_SUCCESS}`);
      handleResponse({
        res,
        code: StatusCodes.ACCEPTED,
        status: RESPONSE_STATUS.SUCCESS,
        message: `Your password is ${message.UPDATE_SUCCESS}`,
      });
    } else {
      logger.error(message.NOT_UPDATE_PASSWORD);
      handleResponse({
        res,
        code: StatusCodes.NOT_FOUND,
        status: RESPONSE_STATUS.ERROR,
        message: message.NOT_UPDATE_PASSWORD,
      });
    }
  } else {
    logger.error(`Your otp or email ${message.DOSE_NOT_MATCH}`);
    handleResponse({
      res,
      code: StatusCodes.NOT_FOUND,
      status: RESPONSE_STATUS.ERROR,
      message: `Your otp or email ${message.DOSE_NOT_MATCH}`,
    });
  }
});
