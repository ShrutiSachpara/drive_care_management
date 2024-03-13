const jwt = require('jsonwebtoken');
const message = require('../utils/message');
const logger = require('../logger/logger');
const { GeneralResponse } = require('../utils/response');
const { RESPONSE_STATUS } = require('../utils/enum');
const { StatusCodes } = require('http-status-codes');
const { GeneralError } = require('../utils/error');

const generateToken = (data) => {
  return jwt.sign({ id: data.id, role: data.role }, process.env.PRIVATEKEY, {
    expiresIn: '365d',
  });
};

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.PRIVATEKEY, (err, user) => {
      if (err) {
        logger.error(err);
        next(
          new GeneralResponse(
            message.TOKEN_INVALID,
            undefined,
            StatusCodes.FORBIDDEN,
            RESPONSE_STATUS.ERROR,
          ),
        );
      }
      req.user = user;
      next();
    });
  } else {
    next(
      new GeneralError(
        message.TOKEN_MISSING,
        StatusCodes.UNAUTHORIZED,
        undefined,
        RESPONSE_STATUS.ERROR,
      ),
    );
  }
};

module.exports = {
  generateToken,
  authenticateJWT,
};
