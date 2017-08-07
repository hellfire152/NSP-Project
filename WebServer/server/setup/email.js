var nodemailer = require('nodemailer');

async function createAccountOtpEmail(emailObj){
  console.log("INSIDE EMAIL SERVER");
  console.log(emailObj);

  var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'exquizit2017@gmail.com',
        pass: '2017Exquizit'
        }
    })

  var mailOptions = {
      from: 'ExQuizIt! Admin <exquizit2017@gmail.com>',
      to: emailObj.email,
      subject: 'ExQuizIt! Account Creation E-mail',
      html: '<p>Dear Sir/Mdm! \n\t You have created an account with the Username: ' +emailObj.username+ ', and Email: '+emailObj.email+'. \n\nLove,\nExQuizIt </p>'
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
        user: 'exquizit2017@gmail.com',
        pass: '2017Exquizit'
        }
    })

  var mailOptions = {
      from: 'ExQuizIt! Admin <exquizit2017@gmail.com>',
      to: emailObj.email,
      subject: 'ExQuizIt! Account Verification',
      html: '<p>Dear Sir/Mdm! \n\t You have to verify your account. \n\tYour verification number is: '+emailObj.pin+'\n\nLove,\nExQuizIt </p>'
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

async function forgetPasswordOtpEmail(emailObj){
  console.log("INSIDE EMAIL SERVER");
  console.log(emailObj);

  var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'exquizit2017@gmail.com',
        pass: '2017Exquizit'
        }
    })

  var mailOptions = {
      from: 'ExQuizIt! Admin <exquizit2017@gmail.com>',
      to: emailObj.email,
      subject: 'ExQuizIt! Forget Password Verification',
      html: '<p>Dear Sir/Mdm! \n\t You have requested for a forget password. \n\tYour verification number is: '+emailObj.pin+'\n\nLove,\nExQuizIt </p>'
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


module.exports = {
  'createAccountOtpEmail' : createAccountOtpEmail,
  'loginAccountOtpEmail' : loginAccountOtpEmail,
  'forgetPasswordOtpEmail' : forgetPasswordOtpEmail
}
