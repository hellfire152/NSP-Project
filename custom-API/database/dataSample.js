/*
  Database sample data will be place here.
  Server can call this sample data for convenience.

  NOTE: this sample data format is required for database server to process.
  NOTE: Please do follow the format when inputing data into database, key must be named excatly.
 */
const C = require("../constants.json");


module.exports = {

  //Sample data to create student account
  studentAcc : function(){
    return studentAcc = {
      data: {
        type : C.DB.CREATE.STUDENT_ACC,
        account : {
          email : "nigel_ncch@hotmail.com",
          password_hash : "PasswordStudent",
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

  loginAccountStudent : function(){
    return userAccount = {
      data : {
        type : C.DB.SELECT.USER_ACCOUNT,
        account : {
          user : "nigelhao",
          password : "PasswordStudent"
        }
      }
    }
  },

  loginAccountTeacher : function(){
    return userAccount = {
      data : {
        type : C.DB.SELECT.USER_ACCOUNT,
        account : {
          user : "nigelhao_teacher",
          password : "PassowordTeachers"
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
          quiz_title : "quiz title",
          visibility : true,
          description : "quiz description",
          quiz_type : "Classic",
          quiz_rating : 5,
          user_id : 1
        },
        question : [
          {
            question_type : C.DB.QUESTION_TYPE.MCQ,
            question_statement : "Question statement 1",
            correct_ans : "ANS 1",
            question_no : 1,
            time : 30
          },
          {
            question_type : C.DB.QUESTION_TYPE.SHORT_ANS,
            question_statement : "Question statement 2",
            correct_ans : "This is the answer for short answer",
            question_no : 2,
            time : 30
          },
          {
            question_type : C.DB.QUESTION_TYPE.SHORT_ANS,
            question_statement : "Question statement 3",
            correct_ans : "No answer",
            question_no : 3,
            time : 30
          },
          {
            question_type : C.DB.QUESTION_TYPE.MCQ,
            question_statement : "Question statement 4",
            correct_ans : "ANS 4",
            question_no : 4,
            time : 30
          },
          {
            question_type : C.DB.QUESTION_TYPE.MCQ,
            question_statement : "Question statement 5",
            correct_ans : "ANS 2",
            question_no : 5,
            time : 30
          }

        ],
        choices : [
          {
            choice_arr : JSON.stringify(['ANS1' , 'ANS2' , 'ANS3' , 'ANS4']),
            question_no : 1
          },
          {
            choice_arr : JSON.stringify(['ANS1' , 'ANS2' , 'ANS3' , 'ANS4']),
            question_no : 4
          },
          {
            choice_arr : JSON.stringify(['ANS1' , 'ANS2' , 'ANS3' , 'ANS4']),
            question_no : 5
          }
        ]
      }
    }
  },

  retrieveAllQuiz : function(){
    return quizSet = {
      data : {
        sessionId : "123",
        type : C.DB.SELECT.ALL_QUIZ
      }
    }
  },

  retrieveQuestion : function(){
    return quizSet = {
      data : {
        sessionId : "123",
        type : C.DB.SELECT.QUESTION,
        quizId : 8
      }
    }
  },

  searchQuiz : function(){
    return searchQuiz = {
      data : {
        type : C.DB.SELECT.SEARCH_QUIZ,
        searchItem : "Hao Nigel"
      }
    }
  }
}
