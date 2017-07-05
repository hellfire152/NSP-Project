// var db = require("./database.js");
var db = require("../database.js");
var cipher = require("../cipher.js")();
const C = require("./clientDbConstants.json");

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

async function handleSearchQuiz(searchItem){
  console.log("IN");
  console.log(searchItem);
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
  console.log(searchArr);
  searchItem.searchArr = searchArr;

  console.log(searchArr);
  console.log("DONE");
  return searchItem;

}

module.exports = function() {
  return {
    'handleCreateAccount' : handleCreateAccount,
    'handleSearchQuiz' : handleSearchQuiz
  }
}
