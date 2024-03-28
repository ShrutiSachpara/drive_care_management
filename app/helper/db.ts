import { Sequelize } from 'sequelize-typescript';
import dbConfig from './db.config';
import { User } from '../model/user';
import { Otp } from '../model/otp.model';

const connection = new Sequelize({
  database: dbConfig.DB_NAME,
  username: dbConfig.DB_USERS,
  password: dbConfig.DB_PASSWORD,
  host: dbConfig.HOST,
  dialect: 'mysql',
  models: [User, Otp],
});

export default connection;
