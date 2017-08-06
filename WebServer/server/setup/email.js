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
              refreshToken: '1/ZutkiQ9OKyp1JkTRAwUiAuvVuHJ4-OVjjyhTD_EmB2c',
              accessToken: 'ya29.GlueBAEudez1kiR7Ozu2EcYe8Puet0Fq5GOmnjWWFsAKzeG59jATxKq8-UrxGBcZfYqCCp7com801PUtLH6QXpyjEawaVuONaH_jx5JnaqLlBqtkJKlq2oWEN9pF'
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
        refreshToken: '1/ZutkiQ9OKyp1JkTRAwUiAuvVuHJ4-OVjjyhTD_EmB2c',
        accessToken: 'ya29.GlueBAEudez1kiR7Ozu2EcYe8Puet0Fq5GOmnjWWFsAKzeG59jATxKq8-UrxGBcZfYqCCp7com801PUtLH6QXpyjEawaVuONaH_jx5JnaqLlBqtkJKlq2oWEN9pF'
          }
    })

  var mailOptions = {
      from: 'ExQuizIt! Admin <chloeangsl@gmail.com>',
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
        refreshToken: '1/ZutkiQ9OKyp1JkTRAwUiAuvVuHJ4-OVjjyhTD_EmB2c',
        accessToken: 'ya29.GlueBAEudez1kiR7Ozu2EcYe8Puet0Fq5GOmnjWWFsAKzeG59jATxKq8-UrxGBcZfYqCCp7com801PUtLH6QXpyjEawaVuONaH_jx5JnaqLlBqtkJKlq2oWEN9pF'

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
          console.log('Email verification has been sent.');
      }
  })
  console.log("EMAIL SENT");
  return true;
}


module.exports = {
  'createAccountOtpEmail' : createAccountOtpEmail,
  'loginAccountOtpEmail' : loginAccountOtpEmail,
  'forgetPasswordOtpEmail' : forgetPasswordOtpEmail
}
