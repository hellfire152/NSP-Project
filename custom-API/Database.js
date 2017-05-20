var mysql = require('mysql');
var crypto = require('crypto');

//Connect to database
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'exquizit'
});

connection.connect(function(error){
  if(!!error){
    console.error('[Failed to connect to database]: ' + error);
  }
  else{
    console.log('[Successfully connected to database]');
  }
});

/**
Create new user account
@param accountType: defines the type of account (host/ student)
@param email: valid and unque email must be given, for account login.
@param password: password to authenticate user email. Password must be hashed using SHA256
@param name: full name of the user
@param accountDetails: object of account details regardless of accountType
*/
function createAccount(accountType, email, password, name, accountDetails){
  console.log(emailAvailable(email));
  if(false){
    var account =
    {
      email : email,
      password_hash : crypto.createHash('SHA256').update(password).digest('base64'), //hash password using SHA256 algorithm
      name : name
    };

    var query = connection.query("INSERT INTO user_account SET ?", account, function(error, result){
      if(error){
        console.error('[Error in query]: ' + error);
        return;
      }

      console.log('[Query successful]');
      console.log(result);
      var userId = result.insertId; //Get the userId form user_account

      if(accountType == 'student'){
        createStudentAccount(userId, accountDetails);
      }
      else if(accountType =='host'){
        createHostAccount(userId, accountDetails)
      }
    });

    console.log('[Account created]');
  }
  else{
    console.log('[Account creation failed]');
    return;
  }
}

/**
 * Check the availabilty of the email, this is to prevent duplicate email in the databases
 * @param  {[string]} email [Search if there is any same email address in database]
 * @return {[boolean]}       [True: Email have not been taken, False: Email have been taken]
 */
function emailAvailable(email){
  console.log(email);

  var available;
  var query = connection.query("SELECT user_id FROM user_account WHERE email = " + connection.escape(email), x = function(error, result){
    // console.log(query);
    if(error){
      console.error('[Error in query]: ' + error);
      return;
    }

    if(result.length === 0){
      console.log("[Email available]");
      available = true;
      return available;
    }
    else{
      console.log("[Email have been taken]");
      available = false;
      return available;
    }
  });

  console.log(x );
}

/**
 * Create new student accountDetails
 * @param  {[int]} userId         [userId is the PK for user_account it is used to reference student_details]
 * @param  {[object]} studentDetails [object of student related information - {username}]
 * @return {[void]}                [void]
 */
function createStudentAccount(userId, studentDetails){

  var studentAccount = {
    user_id: userId,
    username: studentDetails.username,
    achievement: 0
  };

  var query = connection.query("INSERT INTO student_details SET ?", studentAccount, function(error, result){
    if(error){
      console.error('[Error in query]: ' + error);
      return;
    }

    console.log('[Query successful]');
    console.log(result);
  });
}

/**
 * Create new host accountDetails
 * @param  {[int]} userId         [userId is the PK for user_account it is used to reference student_details]
 * @param  {[object]} hostDetails [object of host related information - {currently do not have any variable}]
 * @return {[void]}                [void]
 */
function createHostAccount(userId, hostDetails){

  var hostAccount = {
    user_id: userId,
  };

  var query = connection.query("INSERT INTO host_details SET ?", hostAccount, function(error, result){
    if(error){
      console.error('[Error in query]: ' + error);
      return;
    }

    console.log('[Query successful]');
    console.log(result);
  });
}

// emailAvailable("nigel_ncch@hotmaisl.com");
createAccount("student", "nigel_ncch@hotmail.com", "password_hashed", "Nigel Chen Chin Hao HOST", {username: "nigelhao"});
