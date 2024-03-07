const express = require("express");
const app = express();
require('./app/helper/db');

const port = process.env.PORT || 3000;

app.get('/',(req,res) => {
    res.send('hello world   ')
})

app.listen(port, () => {
  console.log(`Application is running on: http://localhost:${port}`);
});
