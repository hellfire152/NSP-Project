const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
            user: 'chloeangsl@gmail.com',
            clientId: '709561982297-6rtm33rmm3r9gfht1ik8bpgj5j8fglbs.apps.googleusercontent.com',
            clientSecret: 'ov-S6-aeVkziK7zRbZOfDVjo',
            refreshToken: '1/eU5uQIN0H0rAe2h8POnA_dzeWjy4-h0JyqjpaH5Gi5RqZlULIHGzA43lUAvKz9jY',
            accessToken: 'ya29.GluEBDaSLTHtbVkNjdZdwrMjTzybxrovgctjO-AB1ucWRMc6eu24oBJ_a3SKlERX7cKmaIKtc1QyVahUOvV9td1QIZtXLKFPEyZ9uFUCk6vpVGNrpoTMveJgryJu'
            // accessToken: 'ya29.GluEBEUZ_QQlBXuzlKkBx6VfHqdNo7JBy-ZJm4TQJYedcjtCHnI2GkXrafe5eKdWq4pmBblX0tI3MQdK88VTkyI8VAC2zp60C3_mqLsHLIcCwVJm-WEWhiQASU9P'
      }
  })

var mailOptions = {
    from: 'My Name <chloeangsl@gmail.com>',
    to: 'chloeangsl@gmail.com',
    subject: 'testing my verification',
    text: 'Hello World!!'
}

transporter.sendMail(mailOptions, function (err, res) {
    if(err){
        console.log('Error');
    } else {
        console.log('Email Sent');
    }
})
