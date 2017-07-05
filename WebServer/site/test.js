const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        xoauth2: xoauth2.createXOAuth2Generator({
            user: 'chloeangsl@gmail.com',
            clientId: '856574075841-dn1nobjm59p0vrhmvcel4sf4djb6sath.apps.googleusercontent.com',
            clientSecret: 'mHy11MyVPixj1dx44fX30uoV',
            refreshToken: '1/3f97hE7yCmipAtuPcu1iu4EhF3kSmzYicMXiamYMjXY'
        })
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
