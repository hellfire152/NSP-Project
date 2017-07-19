const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
            user: 'chloeangsl@gmail.com',
            clientId: '709561982297-oa3u5nha1eue2aohv5966cdgp60evqb6.apps.googleusercontent.com',
            clientSecret: 'aDT6KfKpSItfcGyHzsPQiOza',
            refreshToken: '1/A-c1xD3ySllNeX9NB58yD-lN0f3c954gpANTOpEV5zA',
            accessToken: 'ya29.GluLBGoKiZhUKdP6YXwiIuawS2SqxGdhu6R8U2h_U7dHo54x4TrJ6RjDmZoEBr_5AmGSW96YPEeEKToNTUPsFT75-a1Xh6pzNl_F6oip_tAd_n0ZieU3JWUY7v6H'
      }
  })

var mailOptions = {
    from: 'My Name <chloeangsl@gmail.com>',
    to: req.body.email,
    subject: 'VERIFICATION EMAIL',
    html: '<p>hello! you have created an account with the Username: ' +req.body.username+ ', and Email: '+req.body.email+'. Your verification number is: '+otp+ ' </p>'
}

transporter.sendMail(mailOptions, function (err, res) {
    if(err){
        console.log('Error');
    } else {
        console.log('Email Sent');
    }
})
