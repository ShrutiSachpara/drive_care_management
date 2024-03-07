const Sequelize = require('sequelize');
require('dotenv').config();
const logger = require('../logger/logger');
const message = require('../utils/message');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERS,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
  }
);

sequelize
  .authenticate()
  .then(() => {
    logger.info(message.DATABASE_CONNECTED);
  })
  .catch((err) => {
    logger.error('error', err);
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.authUserModel = require('../model/user')(sequelize, Sequelize);

db.sequelize.sync().then(() => {
  logger.info('yes re-sync');
}).catch((err) => {
  console.log('no sync error', err);
})

module.exports = db;
