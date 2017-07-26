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
              refreshToken: '1/CDLCZ5T9QsAzPRta4RiEmop4yR_yVqjmMBtMs3yEJA8',
              accessToken: 'ya29.GluUBCvd_iJPv9uFnR4Eix7wqJpwR1X2TAXntqniBczRcI_Y9oZmg36l1isY4v5Djq9rGcTNvSEETo2zO5mdmxQv07E4AYVxwvdRTyuTBOw9BljOsHXDeaNiBauT'
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
        refreshToken: '1/CDLCZ5T9QsAzPRta4RiEmop4yR_yVqjmMBtMs3yEJA8',
        accessToken: 'ya29.GluUBCvd_iJPv9uFnR4Eix7wqJpwR1X2TAXntqniBczRcI_Y9oZmg36l1isY4v5Djq9rGcTNvSEETo2zO5mdmxQv07E4AYVxwvdRTyuTBOw9BljOsHXDeaNiBauT'
          }
    })

  var mailOptions = {
      from: 'ExQuizIt! Admin <chloeangsl@gmail.com>',
      to: emailObj.email,
      subject: 'ExQuizIt! Verification',
      html: '<p>Dear Sir/Mdm! \n\t You have created an account with the Email: '+emailObj.email+'. Your verification number is: '+emailObj.pin+'\n\nLove,\nExQuizIt</p>'
  }
}
