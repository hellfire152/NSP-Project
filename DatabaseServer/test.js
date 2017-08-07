var playerObj = [
  {
    'name': 'nigelhao2',
    'score' : 100,
    'correctAnswers' : 4,
    'wrongAnswers' : 6
  },
  {
    'name': 'nigelhao3',
    'score' : 1003123,
    'correctAnswers' : 3,
    'wrongAnswers' : 4
  }
]

var finalQuery = ""

playerObj.forEach(function(dataObj) {
  finalQuery += "UPDATE completed_quiz\
    JOIN user_account\
    ON user_account.user_id = completed_quiz.user_id\
    SET completed_quiz.no_of_quiz = completed_quiz.no_of_quiz + 1,\
    completed_quiz.score = completed_quiz.score + "+ (dataObj.score)+",\
    completed_quiz.correctAnswers = completed_quiz.correctAnswers + "+ (dataObj.correctAnswers)+",\
    completed_quiz.wrongAnswers = completed_quiz.wrongAnswers + "+ (dataObj.wrongAnswers)+"\
    WHERE user_account.username = "+ (dataObj.name)+";";
});


console.log(finalQuery);
