const uuid = require('uuid');
var passwordValidator =require('password-validator');
module.exports =function(cipher, appConn,C){
  return function(req, res){
    //TODO: Please do all sort of validation here
    var newPassword = req.body.newPassword;
    var confirmPassword = req.body.confirmPassword;
    var userId = JSON.parse(req.cookies.temp_user_id).user_id;
    appConn.send({
      'type' : C.REQ_TYPE.DATABASE,
      'data' : {
        type  : C.DB.UPDATE.CHANGE_PASSWORD,
        'account' : {
          password_hash : newPassword,
          user_id : userId
        }
      }
    }, (response) => {
      //NOTE: If successful, response.data.success return TRUE
      //NOTE: If failed, response.data.success return FALSE
      //NOTE: You can do any form of validation as you wish

      res.clearCookie("temp_user_id");
      res.redirect('/loginform')
    });

  }
}
