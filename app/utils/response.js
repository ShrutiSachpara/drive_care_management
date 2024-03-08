const { StatusCodes } = require('http-status-codes');
const logger = require('../logger/logger');

class GeneralResponse {
  constructor(message, data, statusCode = '', status) {
    logger.info('message', message);
    this.message = message;
    this.statusCode = statusCode == '' ? StatusCodes.OK : statusCode;
    this.data = data;
    this.status = status;
  }
}

module.exports = {
  GeneralResponse,
};