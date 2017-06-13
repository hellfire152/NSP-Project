// var db = require("./database.js");
var db = require("./database.js");
var cipher = require("../cipher.js")();
const C = require("../constants.json");

//Input user data password will undergo hashing and salting before storing to database
async function handleCreateAccount(data){
  cipher.hash(data.account.password_hash)
    .then(cipher => {
      data.account.password_hash = cipher;
    })
    .then(function(){
      cipher.generateSalt()
        .then(saltValue =>{
          data.account.salt = saltValue;
          //function to XOR passoword and salt
        })
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

module.exports = function() {
  return {
    'handleCreateAccount' : handleCreateAccount,
    'handleSearchQuiz' : handleSearchQuiz
  }
}
