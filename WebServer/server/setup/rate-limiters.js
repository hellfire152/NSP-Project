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
    res.sendErrorPage("We're experiencing unusually high amounts of traffic, please hold.\nWe apologize for the inconvenience.");
  }
});

var host = new RateLimit({
  'windowMs' : 1000 * 60 * 60, //1 hour
  'delayAfter' : 30,
  'delayMs' : 200,
  'message' : 'Too many host requests',
  'max' : 500,
  'handler' : (req, res) => {
    res.sendErrorPage("We're experiencing unusually high amounts of traffic, please hold.\nWe apologize for the inconvenience.");
  }
});

var register = new RateLimit({
  'windowMs' : 1000 * 60 * 60, //1 hour
  'delayAfter' : 50,
  'delayMs' : 300, //3 seconds
  'message' : 'Too many register requests!',
  'max' : 200,
  'handler' : (req, res) => {
    res.sendErrorPage("We're experiencing unusually high amounts of traffic, please hold.\nWe apologize for the inconvenience.");
  }
});

var login = new RateLimit({
  'windowMS' : 1000 * 60 * 60,
  'delayAfter' : 50,
  'delayMs' : 1000*60,
  'message' : 'Too many login requests!',
  'max' : 3, // testing purpose
  'handler' : (req, res) => {
    res.sendErrorPage("We're experiencing unusually high amounts of traffic, please hold.\nWe apologize for the inconvenience.");
  }
});
var addQuiz = new RateLimit({
  'windowMS' : 1000 * 60 * 60,
  'delayAfter' : 100,
  'delayMs' : 300,
  'message' : 'Too many add quiz requests!',
  'max' : 200,
  'handler' : (req, res) => {
    res.sendErrorPage("We're experiencing unusually high amounts of traffic, please hold.\nWe apologize for the inconvenience.");
  }
});
var changePassword = new RateLimit({
  'windowMS' : 1000 * 60 * 60,
  'delayAfter' : 100,
  'delayMs' : 300,
  'message' : 'Too many change password requests!',
  'max' : 100,
  'handler' : (req, res) => {
    res.sendErrorPage("We're experiencing unusually high amounts of traffic, please hold.\nWe apologize for the inconvenience.");
  }
});
var forgetPassword = new RateLimit({
  'windowMS' : 1000 * 60 * 60,
  'delayAfter' : 100,
  'delayMs' : 300,
  'message' : 'Too many forget password requests!',
  'max' : 100,
  'handler' : (req, res) => {
    res.sendErrorPage("We're experiencing unusually high amounts of traffic, please hold.\nWe apologize for the inconvenience.");
  }
});
var otpCheck = new RateLimit({
  'windowMS' : 1000 * 60 * 60,
  'delayAfter' : 100,
  'delayMs' : 300,
  'message' : 'Too many OTP check requests!',
  'max' : 100,
  'handler' : (req, res) => {
    res.sendErrorPage("We're experiencing unusually high amounts of traffic, please hold.\nWe apologize for the inconvenience.");
  }
});
var otpRegister = new RateLimit({
  'windowMS' : 1000 * 60 * 60,
  'delayAfter' : 100,
  'delayMs' : 300,
  'message' : 'Too many OTP register requests!',
  'max' : 100,
  'handler' : (req, res) => {
    res.sendErrorPage("We're experiencing unusually high amounts of traffic, please hold.\nWe apologize for the inconvenience.");
  }
});
var logout = new RateLimit({
  'windowMS' : 1000 * 60 * 60,
  'delayAfter' : 100,
  'delayMs' : 300,
  'message' : 'Too many logout requests!',
  'max' : 100,
  'handler' : (req, res) => {
    res.sendErrorPage("We're experiencing unusually high amounts of traffic, please hold.\nWe apologize for the inconvenience.");
  }
});

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
