const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');

async function createAccountOtpEmail(emailObj){
  console.log("INSIDE EMAIL SERVER");
  console.log(emailObj);

  var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
              user: 'chloeangsl@gmail.com',
              clientId: '709561982297-oa3u5nha1eue2aohv5966cdgp60evqb6.apps.googleusercontent.com',
              clientSecret: 'aDT6KfKpSItfcGyHzsPQiOza',
              refreshToken: '1/VN_pwv07Fuz_i6hhsuBx0T3-COzXpavT3TvuQYKMChY',
              accessToken: 'ya29.GluVBLcqeSRIg7hdGe2jH6n4MgtrRd0DHcUOV9o_QJr1WObBNkwtCTvbz5RWx-9F4zkKHU0d3pMFnIq04p06H_xjaDRJjhA0u1tT4pnD0pldUK3t44OkudF9Vq3o'
        }
    })

  var mailOptions = {
      from: 'ExQuizIt! Admin <chloeangsl@gmail.com>',
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
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'chloeangsl@gmail.com',
        clientId: '709561982297-oa3u5nha1eue2aohv5966cdgp60evqb6.apps.googleusercontent.com',
        clientSecret: 'aDT6KfKpSItfcGyHzsPQiOza',
        refreshToken: '1/VN_pwv07Fuz_i6hhsuBx0T3-COzXpavT3TvuQYKMChY',
        accessToken: 'ya29.GluVBLcqeSRIg7hdGe2jH6n4MgtrRd0DHcUOV9o_QJr1WObBNkwtCTvbz5RWx-9F4zkKHU0d3pMFnIq04p06H_xjaDRJjhA0u1tT4pnD0pldUK3t44OkudF9Vq3o'
          }
    })

  var mailOptions = {
      from: 'ExQuizIt! Admin <chloeangsl@gmail.com>',
      to: emailObj.email,
      subject: 'ExQuizIt! Verification',
      html: '<p>Dear Sir/Mdm! \n\t You have created an account with the Email: '+emailObj.email+'. Your verification number is: '+emailObj.pin+'\n\nLove,\nExQuizIt</p>'
  }
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
        refreshToken: '1/M7zS8IIbmaPJ2HKKWkii2vaj51E_hSweitd_zPfhG58',
        accessToken: 'ya29.GluVBOBREr9j3nAShHYKRHXAaU2KIk8SiEoQLGWNLN6lfejiEWE9Ji_ulE4yvhei1vpY2FUndqwsajW9XCwZAnonsvqIKMD-NZEpcXljFKA9XrEe7kyV3KEeSMFV'
         }
    })

  var mailOptions = {
      from: 'ExQuizIt! Admin <chloeangsl@gmail.com>',
      to: emailObj.email,
      subject: 'ExQuizIt! Forget Password',
      html: '<p>Dear Sir/Mdm! \n\t You have requested for forget password. Your verification number is: '+emailObj.pin+'\n\nLove,\nExQuizIt</p>'
    }

    transporter.sendMail(mailOptions, function (err, res) {
        if(err){
            console.log('Email send error');
        } else {
            console.log('OTP email has been sent.');
        }
    });
  return true;
}

module.exports = function(s) {
  S = s;
  return {
    'createAccountOtpEmail' : createAccountOtpEmail,
    'loginAccountOtpEmail' : loginAccountOtpEmail,
    'forgetPasswordOtpEmail' : forgetPasswordOtpEmail
  }
}
