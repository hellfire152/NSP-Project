const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');
var S;
async function createAccountOtpEmail(emailObj){
  console.log("INSIDE EMAIL SERVER");
  console.log(emailObj);

  var transporter = nodemailer.createTransport({
      service: S.EMAIL.SERVICE,
      auth: {
        type: S.EMAIL.AUTH.TYPE,
        user: S.EMAIL.AUTH.USER,
        clientId: S.EMAIL.AUTH.CLIENT_ID,
        clientSecret: S.EMAIL.AUTH.CLIENT_SECRET,
        refreshToken: S.EMAIL.AUTH.REFRESH_TOKEN,
        accessToken: S.EMAIL.AUTH.ACCESS_TOKEN
      }
    });

  var mailOptions = {
      from: `ExQuizIt! Admin <${S.EMAIL.AUTH.USER}>`,
      to: emailObj.email,
      subject: 'ExQuizIt! Account Creation Verification',
      html: '<p>Dear Sir/Mdm! \n\t You have created an account with the Username: ' +emailObj.username+ ', and Email: '+emailObj.email+'. \n\tYour verification number is: '+emailObj.pin+'\n\nLove,\nExQuizIt </p>'
  }

  transporter.sendMail(mailOptions, function (err, res) {
      if(err){
          console.log('Email send error');
      } else {
          console.log('Email verification has been sent.');
      }
  })
  return true;
}

async function loginAccountOtpEmail(emailObj){
  console.log("INSIDE EMAIL SERVER");
  console.log(emailObj);

  var transporter = nodemailer.createTransport({
      service: S.EMAIL.SERVICE,
      auth: {
        type: S.EMAIL.AUTH.TYPE,
        user: S.EMAIL.AUTH.USER,
        clientId: S.EMAIL.AUTH.CLIENT_ID,
        clientSecret: S.EMAIL.AUTH.CLIENT_SECRET,
        refreshToken: S.EMAIL.AUTH.REFRESH_TOKEN,
        accessToken: S.EMAIL.AUTH.ACCESS_TOKEN
      }
    });

  var mailOptions = {
      from: `ExQuizIt! Admin <${S.EMAIL.AUTH.USER}>`,
      to: emailObj.email,
      subject: 'ExQuizIt! Verification',
      html: '<p>Dear Sir/Mdm! \n\t You have created an account with the Email: '+emailObj.email+'. Your verification number is: '+emailObj.pin+'\n\nLove,\nExQuizIt</p>'
  }

  transporter.sendMail(mailOptions, function (err, res) {
      if(err){
          console.log('Email send error');
      } else {
          console.log('Email verification has been sent.');
      }
  })
  console.log("EMAIL SENT");
  return true;
}

async function forgetPasswordOtpEmail(emailObj){
  console.log("INSIDE EMAIL SERVER");
  console.log(emailObj);

  var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'chloeangsl@gmail.com',
        clientId: '709561982297-oa3u5nha1eue2aohv5966cdgp60evqb6.apps.googleusercontent.com',
        clientSecret: 'aDT6KfKpSItfcGyHzsPQiOza',
        refreshToken: '1/isumV_3zp2XprLuLbtlRh2Cg-vIurXpuaGFjbCYi4ZI',
        accessToken: 'ya29.GluUBAWLc6T3nE8hYTATPSI2lBUqckZdTwNT24uaVJ3a2vvc9Psuhb-mrUAdDkqmjRsLHAHl18h4OXD51yM8LJQH-1O7MJ43EJ9bTqmRbEUsHpzb3AcNy0eMzFRY'
         }
    })

  var mailOptions = {
      from: 'ExQuizIt! Admin <chloeangsl@gmail.com>',
      to: emailObj.email,
      subject: 'ExQuizIt! Forget Password',
      html: '<p>Dear Sir/Mdm! \n\t You have requested for forget password. Your verification number is: '+emailObj.pin+'\n\nLove,\nExQuizIt</p>'
module.exports = function(s) {
  S = s;
  return {
    'createAccountOtpEmail' : createAccountOtpEmail,
    'loginAccountOtpEmail' : loginAccountOtpEmail
  }
}
