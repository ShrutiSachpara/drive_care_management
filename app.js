const express = require('express');
const app = express();
require('./app/helper/db');
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');

const cors = require('cors');
app.use(cors());

app.use(
  bodyParser.urlencoded({
    extended: false,
    limit: '50mb',
  }),
);

app.get('/', (req, res) => {
  res.send('hello world');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', require('./app/routes/route'));
app.use(require('./app/helper/response'));
app.use(require('./app/helper/error').handleJoiErrors);
app.use(require('./app/helper/error').handleErrors);

app.listen(port, () => {
  console.log(`Application is running on: http://localhost:${port}`);
});
