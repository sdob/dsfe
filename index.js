const cors = require('cors');
const express = require('express');
const logger = require('morgan');

const app = express();
app.use(logger('dev'));
app.use(cors());
app.use(express.static(`${__dirname}/dist`));
app.listen(process.env.PORT || 5000);
