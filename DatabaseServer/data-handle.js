/*
  Database server delegate work to data-handle to process additinal function to
  increase the security of the data or make data easier to interpret by
  database server.

  Author : Nigel Chen Chin Hao
 */
var cipher = require('../custom-API/cipher.js');
var databaseCipher = new cipher({
  'password': 'aVaTyAzkOqweA',
  'iv' : '5dZoC41JFwmLQMYo'
});

var C = require('../custom-API/constants.json');
//Input user data password will undergo hashing and salting before storing to database
async function handlePassword(data){
  await databaseCipher.generateSalt()
    .then(saltValue => {
      data.account.salt = saltValue;
    })
    .then(function(){
      databaseCipher.hash(data.account.password_hash + data.account.salt)
        .then(hashed =>{
          data.account.password_hash = hashed;
        })
    })
    .catch(reason => {
      console.log(reason);
    });
    return data;
}

async function handleHashPass(data){
    databaseCipher.hash(data.verify.password_hash + data.verify.salt)
      .then(hashed =>{
        data.verify.password_hash = hashed;
      })
      .catch(reason => {
        console.log(reason);
      });

    return data;
}

async function handleHashIP(data){
  databaseCipher.hash(data.inputData.ip_address)
  .then(hashed => {
    data.inputData.ip_address = hashed;
  })
  .catch(reason => {
    console.log(reason);
  });

return data;
}

async function handleDeleteAccount(data){
  var dataArr = [];
  var encryptedData = {};
  dataArr.push(data)
  await handleDecryption(dataArr)
  .then(dataDecrypt => {
    data = dataDecrypt[0];
    databaseCipher.hash(data.account.password + data.salt)
    .then(hashed => {
      data.account.password_hash = hashed;
      delete data.account.password;
      delete data.salt;
    })
    .catch(reason => {
      console.log(reason);
    });
  })
  .catch(reason => {
    console.log(reason);
  });

  return data;
}



async function handleRecieveAccount(data){
  var dataArr = [];
  dataArr.push(data); // Push to array to follow the format of encryption

  var plainData;

  await handleDecryption(dataArr)
  .then(dataOut => {
    databaseCipher.hash(dataOut[0].password + dataOut[0].salt)
    .then(hashed => {
      dataOut[0].hash_password = hashed;
      plainData = dataOut[0];
    })
    .catch(reason => {
      console.log(reason);
    });

  })
  .catch(reason => {
    console.log(reason);
  });
  return plainData;
}

//Seperate the words in a string of text, and the store each individual word in an array.
async function handleSearchQuiz(searchItem){
  var searchArr = [];
  var word = "";
  for(i=0 ; i<searchItem.searchItem.length ; i++){
    if(searchItem.searchItem.charAt(i) === " "){
      searchArr.push(word);
      word = "";
      continue;
    }
    word += searchItem.searchItem.charAt(i);
  }
  searchArr.push(word);
  searchItem.searchArr = searchArr;

  return searchItem;

}

//Convert string into integer for quiz solution
//Convert JASON string to object for choices
async function handleRecieveQuestion(data){
  var num;
  data.forEach(function(individualData){
    console.log(individualData);
    if(individualData.choices === null){
      delete individualData.choices
    }
    if(individualData.reward === null){
      delete individualData.reward
    }
    if(individualData.penalty === null){
      delete individualData.penalty
    }
    num = parseInt(individualData.solution);
    if(!isNaN(num)){
      individualData.solution = num;
    }
    if(individualData.type === C.DB.QUESTION_TYPE.MCQ){
      individualData.choices = JSON.parse(individualData.choices);
    }
  });
  return data;
}

async function handleEncryption(data){
  // return data; //For testing purposes where data will not be encrypted before storing to database
  var databaseCipherData;
  await databaseCipher.encryptDbData(data)
  .then(dataOut => {
    databaseCipherData = dataOut;
  });
  return databaseCipherData;
}

async function handleDecryption(data){
  // return data; //For testing purposes where data will not be decrypted before processing data to client
  var plainData;
  await databaseCipher.decryptDbData(data)
  .then(dataOut => {
    plainData = dataOut;
  });
  return plainData;
}

module.exports = function(data) {
  if(data.databaseCipher === undefined || data.C === undefined)
    throw new Error("databaseCipher or C not set!");
  ({databaseCipher, C} = data);
  return {
    'handlePassword' : handlePassword,
    "handleRecieveAccount" : handleRecieveAccount,
    'handleSearchQuiz' : handleSearchQuiz,
    'handleRecieveQuestion' : handleRecieveQuestion,
    'handleEncryption' : handleEncryption,
    'handleDecryption' : handleDecryption,
    'handleHashPass' : handleHashPass,
    'handleDeleteAccount' : handleDeleteAccount,
    'handleHashIP' : handleHashIP
  }
}
