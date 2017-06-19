/*
  Database server delegate work to data-handle to process additinal function to
  increase the security of the data or make data easier to interpret by
  database server.

  Author : Nigel Chen Chin Hao
 */

var cipher = require("../custom-API/cipher.js")();
const C = require("../custom-API/constants.json");

//Input user data password will undergo hashing and salting before storing to database
async function handleCreateAccount(data){
  cipher.generateSalt()
    .then(saltValue => {
      data.account.salt = saltValue;
    })
    .then(function(){
      cipher.hash(data.account.password_hash + data.account.salt)
        .then(hashed =>{
          data.account.password_hash = hashed;
        })
    })
    .catch(reason => {
      console.log(reason);
    });

    return data;
}

async function handleRecieveAccount(data){
  cipher.hash(data.account.password + data.account.salt)
  .then(hashed => {
    data.account.hash_password = hashed;
  })
  .catch(reason => {
    console.log(reason);
  });
  return data;
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
  var cipherData;
  await cipher.encryptDbData(data)
  .then(dataOut => {
    cipherData = dataOut;
  });
  return cipherData;
}

async function handleDecryption(data){
  var plainData;
  await cipher.decryptDbData(data)
  .then(dataOut => {
    plainData = dataOut;
  });
  return plainData;
}

module.exports = function() {
  return {
    'handleCreateAccount' : handleCreateAccount,
    "handleRecieveAccount" : handleRecieveAccount,
    'handleSearchQuiz' : handleSearchQuiz,
    'handleRecieveQuestion' : handleRecieveQuestion,
    'handleEncryption' : handleEncryption,
    'handleDecryption' : handleDecryption
  }
}
