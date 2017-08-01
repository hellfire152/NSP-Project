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
              refreshToken: '1/jJpuldc9WfNYvKZ6jV3PHRQGXf1B2oC_M_OuYsEcWkg',
              accessToken: 'ya29.GluaBOkc2R5mxfxEfGv4z4oF-KK6HRr-bhMaFO3UBdX5knDir1eJBW2swMgxOL6F_F4sShKYY6yayPZ4iGLeYj884C73f7PA4J03SlG4JoRisdlz7NPrzGa_RPt_'
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
        refreshToken: '1/jJpuldc9WfNYvKZ6jV3PHRQGXf1B2oC_M_OuYsEcWkg',
        accessToken: 'ya29.GluaBOkc2R5mxfxEfGv4z4oF-KK6HRr-bhMaFO3UBdX5knDir1eJBW2swMgxOL6F_F4sShKYY6yayPZ4iGLeYj884C73f7PA4J03SlG4JoRisdlz7NPrzGa_RPt_'
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
        refreshToken: '1/jJpuldc9WfNYvKZ6jV3PHRQGXf1B2oC_M_OuYsEcWkg',
        accessToken: 'ya29.GluaBOkc2R5mxfxEfGv4z4oF-KK6HRr-bhMaFO3UBdX5knDir1eJBW2swMgxOL6F_F4sShKYY6yayPZ4iGLeYj884C73f7PA4J03SlG4JoRisdlz7NPrzGa_RPt_'
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
