const uuid = require('uuid');
modules.exports =function(cipher, appConn){
  return function(req, res){

    var name = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var password=document.getElementById('password')
    if (name != "" && email != "" && password!=""){
      console.log ("not Empty");
    }
    else{
      console.log("EMPTY WHY LEH");
    }

  }
}
