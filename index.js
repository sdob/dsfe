const HTTP = require('http-status-codes');
const cors = require('cors');
const express = require('express');
const logger = require('morgan');
const env = process.env.NODE_ENV || 'development';

const app = express();
app.use(logger('dev'));
app.use(cors());
// Force SSL in production
if (env === 'production') {
  app.use(forceSsl);
}

app.use(express.static(`${__dirname}/dist`));
app.listen(process.env.PORT || 5000);

function forceSsl (req, res, next) {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(HTTP.MOVED_PERMANENTLY, ['https://', req.get('Host'), req.url].join(''));
  }
  return next();
}
