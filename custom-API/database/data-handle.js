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

  searchItem.data.searchArr = searchArr;

  console.log(searchArr);
console.log("DONE");
  db(searchItem);


}

module.exports = function() {
  return {
    'handleCreateAccount' : handleCreateAccount,
    'handleSearchQuiz' : handleSearchQuiz
  }
}




  // db(
  //   {
  //     C : C,
  //     data: {
  //       type : C.DB.INSERT.STUDENT_DETAILS,
  //       account : {
  //         email : "nigel_ncch@hotmail.com",
  //         password_hash : "password_not hashed..",
  //         name : "Nigel Chen Chin Hao",
  //         username : "nigelhao"
  //       },
  //       details :{
  //         school : "NYP",
  //         date_of_birth : new Date()
  //       }
  //     }
  //   }
  // );
// }

// var input = {
//   C : C,
//   data: {
//     type : C.DB.INSERT.TEACHER_DETAILS,
//     account : {
//       email : "nigel.zch@gmail.com",
//       password_hash : "password_not hashed..",
//       name : "Nigel teacher",
//       username : "nigelTeacher"
//     },
//     details :{
//       organisation : "NYP TEACHER"
//     }
//   }
// }
// db(input);
//
// var choiceArr = JSON.stringify(['ANS1' , 'ANS2' , 'ANS3' , 'ANS4']);
//
// var input = {
//   C : C,
//   data: {
//     type : C.DB.INSERT.QUIZ,
//     quiz : {
//       quiz_title : "quiz title",
//       visibility : true,
//       description : "quiz description",
//       quiz_rating : 5
//     },
//     question : [
//       {
//         question_type : C.DB.OTHERS.MCQ,
//         question_statement : "Question statement",
//         correct_ans : "ANS",
//         time : 30
//       },
//       {
//         question_type : C.DB.OTHERS.SHORT_ANS,
//         question_statement : "Question statement2",
//         correct_ans : "ANS2",
//         time : 30
//       },
//       {
//         question_type : C.DB.OTHERS.MCQ,
//         question_statement : "Question statement3",
//         correct_ans : "ANS3",
//         time : 30
//       }
//     ],
//     choices : [
//       {
//         choice_arr :choiceArr
//       },
//       {
//         choice_arr : choiceArr
//       }
//     ]
//   }
// }
