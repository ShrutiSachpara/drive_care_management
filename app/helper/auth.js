const jwt = require('jsonwebtoken');
const { RESPONSE_STATUS } = require('../utils/enum');
const message = require('../utils/message');
const logger = require('../logger/logger');
// Middleware for Generating a new JWT Token
const generateToken = (data) => {
  return jwt.sign({ id: data.id, role: data.role }, process.env.PRIVATEKEY, {
    expiresIn: '365d',
  });
};

// Middleware for authorization a JWT Token
const authorization = (roles = []) => {
  return (req, res, next) => {
    try {
      const token = req.header('Authorization');
      if (!token) {
        logger.error(message.AUTH_MISSING);
        res.status(401).json({
          status: RESPONSE_STATUS.ERROR,
          code: 401,
          message: message.AUTH_MISSING,
        });
      }

      const verified = jwt.verify(token, process.env.PRIVATEKEY);
      req.user = verified;
      if (roles.length > 0 && roles.some((role) => role === verified.role)) {
        next();
      } else {
        logger.error(message.ACCESS_REQUIRED);
        res.status(401).json({
          status: RESPONSE_STATUS.ERROR,
          code: 401,
          message: message.ACCESS_REQUIRED,
        });
      }
    } catch (err) {
      let errorResponse =
        err.name === 'TokenExpiredError'
          ? message.TOKEN_EXPIRED
          : err.name === 'JsonWebTokenError'
          ? message.TOKEN_INVALID
          : `${message.REQUEST_FAILURE} authorization.`;

      logger.error(message.errorResponse);
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
  authorization,
};
