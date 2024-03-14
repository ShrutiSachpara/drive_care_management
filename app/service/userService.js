const bcrypt = require('bcrypt');
const db = require('../helper/db');
const message = require('../utils/message');
const { GeneralError } = require('../utils/error');
const { GeneralResponse } = require('../utils/response');
const { StatusCodes } = require('http-status-codes');
const { generateToken } = require('../helper/auth');
const { RESPONSE_STATUS } = require('../utils/enum');
const { findOne, create } = require('../helper/serviceLayer');
const { update } = require('../helper/serviceLayer');
const logger = require('../logger/logger');
const usersModel = db.authUserModel;
const saltRounds = 10;

module.exports = {
  register: async (req, next) => {
    try {
      let { email_id, password } = req.body;
      const findUser = await findOne(usersModel, { email_id });

      if (findUser) {
        next(
          new GeneralResponse(
            `User ${message.ALREADY_REGISTERED}`,
            undefined,
            StatusCodes.BAD_REQUEST,
            RESPONSE_STATUS.ERROR,
          ),
        );
      }

      let updateData = { ...req.body };

      if (req.file) {
        updateData.profile_image = req.file.filename;
      }

      updateData.password = await bcrypt.hash(password, saltRounds);

      await create(usersModel, updateData);

      next(
        new GeneralResponse(
          `Congratulation! You are ${message.REGISTERED_SUCCESS}`,
          undefined,
          StatusCodes.CREATED,
          RESPONSE_STATUS.SUCCESS,
        ),
      );
    } catch (err) {
      logger.error(err);
      next(
        new GeneralError(
          `${message.FAILED_TO} user registration.`,
          StatusCodes.INTERNAL_SERVER_ERROR,
          undefined,
          RESPONSE_STATUS.ERROR,
        ),
      );
    }
  },

  login: async (req, next) => {
    try {
      const { email_id, password } = req.body;

      const findUser = await findOne(usersModel, { email_id });

      if (!findUser) {
        next(
          new GeneralResponse(
            message.USER_NOT_FOUND,
            undefined,
            StatusCodes.NOT_FOUND,
            RESPONSE_STATUS.ERROR,
          ),
        );
      }

      const comparePassword = await bcrypt.compare(password, findUser.password);

      if (comparePassword) {
        let tokenObj = {
          id: findUser.id,
          role: findUser.role,
        };

        const token = generateToken(tokenObj);

        next(
          new GeneralResponse(
            `${findUser.role} is ${message.LOGIN_SUCCESS}`,
            { token },
            StatusCodes.OK,
            RESPONSE_STATUS.SUCCESS,
          ),
        );
      } else {
        next(
          new GeneralResponse(
            `Email and Password ${message.DOES_NOT_MATCH}`,
            undefined,
            StatusCodes.BAD_REQUEST,
            RESPONSE_STATUS.ERROR,
          ),
        );
      }
    } catch (err) {
      logger.error(`${message.FAILED_TO} login.`);
      next(
        new GeneralError(
          `${message.FAILED_TO} login.`,
          StatusCodes.INTERNAL_SERVER_ERROR,
          err?.original?.sqlMessage ? err.original.sqlMessage : err,
          RESPONSE_STATUS.ERROR,
        ),
      );
    }
  },

  viewProfile: async (req, next) => {
    try {
      const userId = req.user.id;
      const userData = await findOne(
        usersModel,
        { id: userId, is_deleted: false },
        ['id', 'name', 'email_id', 'phone_no', 'role', 'profile_image'],
      );
      if (userData) {
        next(
          new GeneralResponse(
            `View Profile Data ${message.GET_SUCCESS}`,
            userData,
            StatusCodes.OK,
            RESPONSE_STATUS.SUCCESS,
          ),
        );
      } else {
        next(
          new GeneralResponse(
            message.NOT_FOUND,
            undefined,
            StatusCodes.NOT_FOUND,
            RESPONSE_STATUS.ERROR,
          ),
        );
      }
    } catch (err) {
      logger.error(`${message.FAILED_TO} view profile`);
      next(
        new GeneralResponse(
          `${message.FAILED_TO} view profile`,
          undefined,
          StatusCodes.INTERNAL_SERVER_ERROR,
          RESPONSE_STATUS.ERROR,
        ),
      );
    }
  },

  updateProfile: async (req, next) => {
    try {
      const id = req.user.id;

      const existingUser = await findOne(usersModel, { id });

      if (!existingUser) {
        next(
          new GeneralError(
            `${message.FAILED_TO} find user.`,
            StatusCodes.INTERNAL_SERVER_ERROR,
            undefined,
            RESPONSE_STATUS.ERROR,
          ),
        );
      }

      let updateData = { ...req.body };

      if (req.file) {
        updateData.profile_image = req.file.filename;
      }

      const [updatedProfile] = await update(
        usersModel,
        { id: req.user.id },
        updateData,
      );

      if (updatedProfile === 1) {
        next(
          new GeneralResponse(
            `Your profile is ${message.UPDATE_SUCCESS}`,
            undefined,
            StatusCodes.OK,
            RESPONSE_STATUS.SUCCESS,
          ),
        );
      } else {
        next(
          new GeneralResponse(
            `${message.FAILED_TO} update profile`,
            undefined,
            StatusCodes.BAD_REQUEST,
            RESPONSE_STATUS.ERROR,
          ),
        );
      }
    } catch (err) {
      next(
        new GeneralError(
          `${message.REQUEST_FAILURE} update profile.`,
          StatusCodes.INTERNAL_SERVER_ERROR,
          undefined,
          RESPONSE_STATUS.ERROR,
        ),
      );
    }
  },
};
