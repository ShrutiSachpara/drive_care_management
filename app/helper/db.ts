import { Sequelize } from 'sequelize-typescript';
import dbConfig from './db.config';

const connection = new Sequelize({
  database: dbConfig.DB_NAME,
  username: dbConfig.DB_USERS,
  password: dbConfig.DB_PASSWORD,
  host: dbConfig.HOST,
  dialect: 'mysql',
  models: [],
});

export default connection;
