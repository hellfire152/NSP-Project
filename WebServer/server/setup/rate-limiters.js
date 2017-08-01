/*
  The various limiters to be implemented in GET / POST requests

  Author: Jin Kuan
*/

var RateLimit = require('express-rate-limit');

var join = new RateLimit({
  'windowMs' : 1000 * 60 * 60, //1 hour
  'delayAfter' : 200,
  'delayMs' : 100,
  'message' : 'Too many join requests!',
  'max' : 10000,
  'handler' : (req, res) => {
    sendErrorPage(res);
  }
});

var host = new RateLimit({
  'windowMs' : 1000 * 60 * 60, //1 hour
  'delayAfter' : 30,
  'delayMs' : 200,
  'message' : 'Too many host requests',
  'max' : 500,
  'handler' : (req, res) => {
    sendErrorPage(res);
  }
});

var register = new RateLimit({
  'windowMs' : 1000 * 60 * 60, //1 hour
  'delayAfter' : 50,
  'delayMs' : 300, //3 seconds
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
