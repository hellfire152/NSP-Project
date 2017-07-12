

var query = connection.query("SELECT user_account.user_id, user_account.name, user_account.username, user_account.email, student_details.student_id, student_details.date_of_birth, student_details.school\
  FROM user_account\
  LEFT OUTER JOIN student_details\
  ON user_account.user_id = student_details.user_id\
  WHERE student_details.user_id = " + connection.escape(dataOut.userId),
function(err, result){
  if(err){
    console.log(result);
    console.error('[Error in query]: ' + err);
    var response = {
      data : {
        success : false,
        reason : C.ERR.DB_SQL_QUERY,
        message : err
      }
    }
    sendToServer(response, inputData);
  }
  if(result.length === 1){
    handleDb.handleDecryption(result)
    .then(resultOut => {
      objOutResult = {
        data:{
          data : resultOut,
          success : true
        }
      }
      sendToServer(objOutResult, inputData);
    })
    .catch(reason => {
      console.log(reason);
    });
  }
  else if(result.length === 0){
    var query = connection.query("SELECT user_account.user_id, user_account.name, user_account.username, user_account.email, teacher_details.teacher_id, teacher_details.organisation\
      FROM user_account\
      LEFT OUTER JOIN teacher_details\
      ON user_account.user_id = teacher_details.user_id\
      WHERE teacher_details.user_id = " + connection.escape(dataOut.userId),
    function(err, result){
      if(err){
        console.error('[Error in query]: ' + err);
        var response = {
          data : {
            success : false,
            reason : C.ERR.DB_SQL_QUERY,
            message : err
          }
        }
        sendToServer(response, inputData);
      }
      if(result.length === 1){
        handleDb.handleDecryption(result)
        .then(resultOut => {
          objOutResult = {
            data:{
              data : resultOut,
              success : true
            }
          }
          sendToServer(objOutResult, inputData);
        })
        .catch(reason => {
          console.log(reason);
        });
      }
      else if(result.length === 0){
        console.log("[No related data found]");
        //TODO: Send error message to server
        var response = {
          data : {
            success : false,
            reason : C.ERR.DB_NO_SUCH_USER,
            message : "No such user"
          }
        }
        sendToServer(response, inputData);
      }
      else{
        console.log("[Duplicate user_id, Entity integrity compromise]");
        //TODO: Send error message to server
        var response = {
          data : {
            success : false,
            reason : C.ERR.DB_DUPLICATE_USER_ID,
            message : "Duplicate user_id"
          }
        }
        sendToServer(response, inputData);

      }
    });
  }
  else{
    console.log("[Duplicate user_id, Entity integrity compromise]");
    //TODO: Send error message to server
    var response = {
      data : {
        success : false,
        reason : C.ERR.DB_DUPLICATE_USER_ID,
        message : "Duplicate user_id"
      }
    }
    sendToServer(response, inputData);
  }
});
