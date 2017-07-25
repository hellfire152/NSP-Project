var RateLimit = require('express-rate-limit');

var join = new RateLimit({
  'windowMs' : 1000 * 60 * 60 //1 hour
  'delayAfter' : 2,
  'delayMs' : 1000,
  'message' : 'Too many join requests!',
  'max' : 10000,
  'handler' : (req, res) => {
    sendErrorPage(res);
  }
});

var host = new RateLimit({
  'windowMs' : 1000 * 60 * 60 //1 hour
  'delayAfter' : 1,
  'delayMs' : 2000,
  'message' : 'Too many host requests',
  'max' : 500,
  'handler' : (req, res) => {
    sendErrorPage(res);
  }
});

var register = new RateLimit({
  'windowMs' : 1000 * 60 * 60 //1 hour
  'delayAfter' : 5,
  'delayMs' : 1000 * 3 //3 seconds
  'message' : 'Too many register requests!',
  'max' : 200,
  'handler' : (req, res) => {
    sendErrorPage(res);
  }
});

function sendErrorPage(res, error) {
  res.render('error', {
    'error' : (error === undefined)?
      "We've detected suspicious activity, you've been blocked for a while" : error
  });
}

module.exports = {
  'join' : join,
  'host' : host,
  'register' : register
};
