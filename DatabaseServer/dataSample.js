/*
  Database sample data will be place here.
  Server can call this sample data for convenience.

  NOTE: this sample data format is required for database server to process.
  NOTE: Please do follow the format when inputing data into database, key must be named excatly.
 */
const C = require("../custom-API/constants.json");


module.exports = {

  //Sample data to create student account
  studentAcc : function(){
    return studentAcc = {
      data: {
        type : C.DB.CREATE.STUDENT_ACC,
        account : {
          email : "nigel_ncch@hotmail.com23",
          password_hash : "pass",
          name : "Nigel Chen Chin Hao",
          username : "nigelhao"
        },
        details :{
          school : "NYP",
          date_of_birth : new Date()
        }
      }
    }
  },

  teacherAcc : function(){
    return teacherAcc = {
      data: {
        type : C.DB.CREATE.TEACHER_ACC,
        account : {
          email : "nigel.zch@gmail.com",
          password_hash : "PassowordTeachers",
          name : "Nigel Chen Chin Hao Teacher",
          username : "nigelhao_teacher"
        },
        details :{
          organisation : "NYP organisation"
        }
      }
    }
  },

  loginStudentAcc : function(){
    return userAccount = {
      data : {
        type : C.DB.SELECT.USER_ACCOUNT,
        account : {
          username : "nigelhao",
          password : "PasswordStudent"
        }
      }
    }
  },

  loginTeacherAcc : function(){
    return userAccount = {
      data : {
        type : C.DB.SELECT.USER_ACCOUNT,
        account : {
          username : "nigelhao_teacher",
          password : "PassowordTeachers"
        }
      }
    }
  },
  deleteAccount : function(){
    return deleteAccount = {
      data : {
        type : C.DB.DELETE.ACCOUNT,
        account : {
          user_id : 11,
          username : "username",
          email : "email@email.com",
          password : "pass"
        }
      }
    }
  },
  updataPass : function(){
    return updatepassword = {
      data : {
        type : C.DB.UPDATE.PASSWORD,
        verify : {
          user_id : 1,
          password_hash : "passChanged"
        },
        account : {
          password_hash : "pass"
        }
      }
    }
  },
  updateQuiz : function(){
    return updatepassword = {
      data : {
        type : C.DB.UPDATE.QUIZ,
        quiz : {
          quiz_title : "HELLO",
          description : "YO",
          visibility : false,
          quiz_id : 12
        }
      }
    }
  },

  //Sample data to create a new quiz
  //questions: is an array
  //choices: is an array
  createQuiz : function(){
    return quizSet = {
      data : {
        type : C.DB.CREATE.QUIZ,
        quiz : {
          quiz_title : "Know your product",
          visibility : true,
          description : "About new technology",
          quiz_type : "Classic",
          quiz_rating : 5,
          user_id : 1
        },
        question : [
          {
            type : C.DB.QUESTION_TYPE.MCQ,
            prompt : "Question statement 1",
            solution : '1',
            question_no : 1,
            time : 30
          },
          {
            type : C.DB.QUESTION_TYPE.SHORT_ANS,
            prompt : "Question statement 2",
            solution : "This is the answer for short answer",
            question_no : 2,
            time : 30
          },
          {
            type : C.DB.QUESTION_TYPE.SHORT_ANS,
            prompt : "Question statement 3",
            solution : "No answer",
            question_no : 3,
            time : 30
          },
          {
            type : C.DB.QUESTION_TYPE.MCQ,
            prompt : "Question statement 4",
            solution : '8',
            question_no : '4',
            time : 30
          },
          {
            type : C.DB.QUESTION_TYPE.MCQ,
            prompt : "Question statement 5",
            solution : '1',
            question_no : 5,
            time : 30
          }

        ],
        choices : [
          {
            choices : JSON.stringify(['ANS1' , 'ANS2' , 'ANS3' , 'ANS4']),
            question_no : 1
          },
          {
            choices : JSON.stringify(['ANS1' , 'ANS2' , 'ANS3' , 'ANS4']),
            question_no : 4
          },
          {
            choices : JSON.stringify(['ANS1' , 'ANS2' , 'ANS3' , 'ANS4']),
            question_no : 5
          }
        ]
      }
    }
  },

  retrieveAllQuiz : function(){
    return quizSet = {
      data : {
        type : C.DB.SELECT.ALL_QUIZ
      }
    }
  },

  retrieveQuestion : function(){
    return quizSet = {
      data : {
        type : C.DB.SELECT.QUESTION,
        quizId : 1
      }
    }
  },

  searchQuiz : function(searchItem){
    return searchQuiz = {
      data : {
        type : C.DB.SELECT.SEARCH_QUIZ,
        searchItem : searchItem
      }
    }
  },

  updateQuestion : function(){
    return updateQuestion = {
      data : {
        type : C.DB.UPDATE.QUESTION,
        changes : {
          prompt : "Prompt Changed2",
          solution : "Solution Changed2",
          choices : "CHOICES CHANGED",
          time : " 200000"
        },
        questionId : 55
      }
    }
  },
  updateAccount : function(){
    return updateProfile = {
      data : {
        type : C.DB.UPDATE.USER_ACCOUNT,
        changes : {
          username : "nigelhao2",
          // email : "email@email.com",
          name : "new name"
        },
        user_id : 8
      }
    }
  }
}
