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

const authenticateJWT = (roles = []) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        logger.error(message.TOKEN_MISSING);
        next(
          new GeneralError(
            message.TOKEN_MISSING,
            StatusCodes.UNAUTHORIZED,
            undefined,
            RESPONSE_STATUS.ERROR,
          ),
        );
      }

      const token = authHeader.split(' ')[1];
      const verified = jwt.verify(token, process.env.PRIVATEKEY);

      req.user = verified;

      if (roles.length > 0 && !roles.includes(verified.role)) {
        logger.error(message.ACCESS_REQUIRED);
        return res.status(403).json({
          status: RESPONSE_STATUS.ERROR,
          code: 403,
          message: message.ACCESS_REQUIRED,
        });
      }

      next();
    } catch (err) {
      let errorResponse =
        err.name === 'TokenExpiredError'
          ? message.TOKEN_EXPIRED
          : err.name === 'JsonWebTokenError'
          ? message.TOKEN_INVALID
          : `${message.REQUEST_FAILURE} authorization.`;

      logger.error(errorResponse);
      res.status(401).json({
        status: RESPONSE_STATUS.ERROR,
        code: 401,
        message: errorResponse,
      });
    }
  };
};

module.exports = {
  generateToken,
  authenticateJWT,
};
