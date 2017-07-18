//login

const uuid = require('uuid');
module.exports = function(cipher, appConn, C, xssDefense) {
  return function(req, res) {
    req.sanitize('otp').escape();

    var errors = req.validationErrors();

    if(errors) {
      //TODO::Handle errors
    } else {
      var userOTP = req.body.otp;
      var otpObj = JSON.parse(req.cookies.otp);

      if(userOTP == otpObj.pin){
        //TODO: Get data from database and send to client and redirect to new page
        appConn.send({
          'type' : C.REQ_TYPE.DATABASE,
          'data' : {
            type : C.DB.SELECT.FULL_USER_ACCOUNT,
            user_id : otpObj.user_id
          }
        } ,(response) => {
            console.log("SUCCESS");
            appConn.send({
              'type' : C.REQ_TYPE.DATABASE,
              'data' : {
                type : C.DB.CREATE.IP_ADDRESS,
                inputData : {
                  user_id : otpObj.user_id,
                  ip_address : otpObj.userIp
                  // ip_address : Math.floor((Math.random() * 10000) + 1).toString() //Mock up of new IP address TODO: Get IP address from client
                }
              }
            }, (response2) => {
              var encodedData = xssDefense.jsonEncode(response.data.data[0]);
              res.clearCookie("otp");
              if(req.cookies.deviceIP != undefined){
                var ipArr = JSON.parse(req.cookies.deviceIP);
                console.log(ipArr);
                ipArr.push(response2.data.data.hashedIpAddress);
                res.cookie('deviceIP', JSON.stringify(ipArr), {"maxAge": 1000*60*60*24*30}); // max age: 30 days
              }
              else{
                var newIpArr = [response2.data.data.hashedIpAddress];
                res.cookie('deviceIP', JSON.stringify(newIpArr), {"maxAge": 1000*60*60*24*30}); // max age: 30 days
              }
              res.cookie('user_info', JSON.stringify(encodedData));
              res.render('LoginIndex',{
                data: response.data
              });
            });
        });
      }
      else{
        //Go back to OTP page and try again
        //More than 3 time boot out and clear cookies
        if(otpObj.count < 3){
          otpObj.count++;
          res.cookie('otp', JSON.stringify(otpObj), {"maxAge": 1000*60*5}); //5 min
          res.redirect('/otp');
        }
        else{
          console.log("HERE");
          res.clearCookie("otp");
          res.redirect('/LoginForm');
        }
      }
    }
  }
}
