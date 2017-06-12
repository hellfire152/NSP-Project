// var db = require("./database.js");
var db = require("../database.js");
var cipher = require("../cipher.js")();
const C = require("./clientDbConstants.json");

//Input user data password will undergo hashing and salting before storing to database
async function handleCreateAccount(userAccount){
  cipher.hash(userAccount.data.account.password_hash)
    .then(cipher => {
      userAccount.data.account.password_hash = cipher;
      console.log(cipher);
      console.log(cipher.length);
    })
    .then(function(){
      cipher.generateSalt()
        .then(saltValue =>{
          userAccount.data.account.salt = saltValue;
          //function to XOR passoword and salt
        })
        .then(function(){
          db(userAccount);
        })
    })
    .catch(reason => {
      console.log(reason);
    });
}

async function handleSearchQuiz(searchItem){
  console.log("IN");
  console.log(searchItem);
  var searchArr = [];
  var word = "";
  for(i=0 ; i<searchItem.data.searchItem.length ; i++){
    if(searchItem.data.searchItem.charAt(i) === " "){
      searchArr.push(word);
      word = "";
      continue;
    }
    word += searchItem.data.searchItem.charAt(i);
  }
  searchArr.push(word);
console.log(searchArr);
  searchItem.data.searchArr = searchArr;

  console.log(searchArr);
console.log("DONE");
console.log(searchItem.data);
  db(searchItem);

}

module.exports = function() {
  return {
    'handleCreateAccount' : handleCreateAccount,
    'handleSearchQuiz' : handleSearchQuiz
  }
}
