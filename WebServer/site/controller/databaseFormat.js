
function formatData(input){
  console.log("Formating data");
  var output;

  switch(input.type){
    case C.DB.CREATE.STUDENT_ACC : {
      output = createStudentAccount(input);
      break;
    }
    case C.DB.CREATE.TEACHER_ACC : {
      output = createTeacherAccount(input);
      break;
    }
    case C.DB.SELECT.USER_ACCOUNT : {
      output = loginAccount(input);
      break;
    }
    case C.DB.SELECT.QUESTION : {
      output = retrieveQuestion(input);
      break;
    }
    case C.DB.SELECT.SEARCH_QUIZ : {
      output = searchQuiz(input);
      break;
    }
    default : {
      console.log("No such constants");
    }
  }
  return output;
}

function createStudentAccount(input){
  return {
    data: {
      type : input.type,
      account : {
        email : input.email,
        password_hash : input.password,
        name : input.name,
        username : input.username
      },
      details :{
        school : input.school,
        date_of_birth : new Date()
      }
    }
  }
}

function createTeacherAccount(input){
  return {
    data: {
      type : input.type,
      account : {
        email : input.email,
        password_hash : input.passowrd,
        name : input.name,
        username : input.username
      },
      details :{
        organisation : input.organisation
      }
    }
  }
}

function loginAccount(input){
  return {
    data : {
      type : input.type,
      account : {
        username : input.user,
        password : input.password
      }
    }
  }
}

function retrieveQuestion(input){
  return {
    data : {
      type : input.type,
      quizId : input.quizId
    }
  }
}

function searchQuiz(input){
  return {
    data : {
      type : input.type,
      searchItem : input.searchItem
    }
  }
}
