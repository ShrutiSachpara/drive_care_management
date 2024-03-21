import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connection from './app/helper/db';
import {
  handleJoiErrors,
  handleErrors,
  errorHandler,
  asyncHandler,
} from './app/helper/error';
import { logger } from './app/logger/logger';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('hello world');
});

app.use(handleJoiErrors);
app.use(handleErrors);
app.use(errorHandler);
app.use(asyncHandler);

connection
  .sync()
  .then(() => {
    logger.info('Database connected successfully');
  })
  .catch((err) => {
    logger.error('Database connection error:', err);
  });

app.listen(port, () => {
  console.log(`Application is running on: http://localhost:${port}`);
});
