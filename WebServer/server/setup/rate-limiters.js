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

var login = new RateLimit({
  'windowMS' : 1000 * 60 * 60,
  'delayAfter' : 50,
  'delayMs' : 1000*60,
  'message' : 'Too many login requests!',
  'max' : 5, // testing purpose
  'handler' : (req, res) => {
    sendErrorPage(res);
  }
});
var addQuiz = new RateLimit({
  'windowMS' : 1000 * 60 * 60,
  'delayAfter' : 100,
  'delayMs' : 300,
  'message' : 'Too many add quiz requests!',
  'max' : 200,
  'handler' : (req, res) => {
    sendErrorPage(res);
  }
});
var changePassword = new RateLimit({
  'windowMS' : 1000 * 60 * 60,
  'delayAfter' : 100,
  'delayMs' : 300,
  'message' : 'Too many change password requests!',
  'max' : 100,
  'handler' : (req, res) => {
    sendErrorPage(res);
  }
});
var forgetPassword = new RateLimit({
  'windowMS' : 1000 * 60 * 60,
  'delayAfter' : 100,
  'delayMs' : 300,
  'message' : 'Too many forget password requests!',
  'max' : 100,
  'handler' : (req, res) => {
    sendErrorPage(res);
  }
});
var otpCheck = new RateLimit({
  'windowMS' : 1000 * 60 * 60,
  'delayAfter' : 100,
  'delayMs' : 300,
  'message' : 'Too many OTP check requests!',
  'max' : 100,
  'handler' : (req, res) => {
    sendErrorPage(res);
  }
});
var otpRegister = new RateLimit({
  'windowMS' : 1000 * 60 * 60,
  'delayAfter' : 100,
  'delayMs' : 300,
  'message' : 'Too many OTP register requests!',
  'max' : 100,
  'handler' : (req, res) => {
    sendErrorPage(res);
  }
});
var logout = new RateLimit({
  'windowMS' : 1000 * 60 * 60,
  'delayAfter' : 100,
  'delayMs' : 300,
  'message' : 'Too many logout requests!',
  'max' : 100,
  'handler' : (req, res) => {
    sendErrorPage(res);
  }
});
//adding one more for profile
function sendErrorPage(res, error) {
  res.render('error', {
    'error' : (error === undefined)?
      "We've detected suspicious activity, you've been blocked for a while" : error
  });
}

module.exports = {
  'join' : join,
  'host' : host,
  'register' : register,
  'login' :login,
  'addQuiz':addQuiz,
  'otpCheck':otpCheck,
  'otpRegister':otpRegister,
  'changePassword':changePassword,
  'forgetPassword':forgetPassword,
  'logout':logout
};
