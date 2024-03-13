const express = require('express');
const router = express();

router.use('/api/user', require('./router/userRoute'));

module.exports = router;
