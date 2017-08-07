var client_completed_quizzes = [{
    quiz_id: 23,
    user_id: 123,
    quiz_title: "Test QUiz 1",
    quiz_type: "Classic",
    visibility: 1,
    description: "This is test quiz 1",
    quiz_rating: 5,
    date_created: "2017-06-15"
},{
    quiz_id: 24,
    user_id: 123,
    quiz_title: "Test QUiz 2",
    quiz_type: "Classic",
    visibility: 1,
    description: "This is test quiz 2",
    quiz_rating: 3,
    date_created: "2017-06-17"
},
{
    quiz_id: 25,
    user_id: 123,
    quiz_title: "Test QUiz 3",
    quiz_type: "Classic",
    visibility: 1,
    description: "This is test quiz 3",
    quiz_rating: 4,
    date_created: "2017-05-06"
}];

//Sample data completed quiz question quiz id 23
var questionQuiz23 = [{
    question_id :105,
    quiz_id: 23,
    question_no: 1,
    type:0,
    prompt: "Question statement 1",
    solution:2,
    time:30
},{
    question_id :106,
    quiz_id: 23,
    question_no: 2,
    type:1,
    prompt: "Question statement 2",
    solution:"stupid",
    time:30
} ,{
     question_id :107,
    quiz_id: 23,
    question_no: 3,
    type:1,
    prompt: "Question statement 3",
    solution:"rubbish",
    time:30
},{
    question_id :108,
    quiz_id: 23,
    question_no: 4,
    type:0,
    prompt: "Question statement 4",
    solution:2,
    time:30
}];

var questionQuiz25 = [{
    question_id :110,
    quiz_id: 25,
    question_no: 1,
    type:0,
    prompt: "Question statement 1",
    solution: 2,
    time:30
},{
    question_id :111,
    quiz_id: 25,
    question_no: 2,
    type:1,
    prompt: "Question statement 2",
    solution:"stupid",
    time:30
} ,{
     question_id :112,
    quiz_id: 25,
    question_no: 3,
    type:1,
    prompt: "Question statement 3",
    solution:"rubbish",
    time:30
}];
// Sample data (Client Hosted QUiz)
// User Id will be 123

var hostedQuiz = [{
    quiz_id: 345,
    user_id: 123,
    quiz_title: "HELLo1",
    quiz_type: "classic",
    visibility:1,
    description: "HELLO TEST DESCRIPTION",
    quiz_rating: 5,
    date_created: "2017-06-15"
},{
    quiz_id: 346,
    user_id: 123,
    quiz_title: "HELLo2",
    quiz_type: "classic",
    visibility:1,
    description: "HELLO TEST DESCRIPTION",
    quiz_rating: 5,
    date_created: "2017-06-15"
},
{
    quiz_id: 347,
    user_id: 123,
    quiz_title: "HELLo3",
    quiz_type: "classic",
    visibility:1,
    description: "HELLO TEST DESCRIPTION",
    quiz_rating: 5,
    date_created: "2017-06-15"
}
];

var hosted_question345 =[{
    question_id: 105,
    quiz_id: 345,
    question_no: 1,
    type: 0,
    prompt: "Question statement 1",
    solution: 2,
    time: 30
},{
    question_id: 106,
    quiz_id: 345,
    question_no: 2,
    type: 1,
    prompt: "Question statement 2",
    solution: "THIS IS THE ANS",
    time: 30
},{
    question_id: 107,
    quiz_id: 345,
    question_no: 3,
    type: 1,
    prompt: "Question statement 3",
    solution: "No answer",
    time: 30
}];

var achievement = [{
    achievement_id: 1,
    title: "TEST ACHIEVEMENT 1",
    points: 128,
    description: "TEST ACHIEVEMENT CARD"
},{
    achievement_id: 2,
    title: "TEST ACHIEVEMENT 2",
    points: 256,
    description: "TEST ACHIEVEMENT CARD"
},{
    achievement_id: 3,
    title: "TEST ACHIEVEMENT 3",
    points: 512,
    description: "TEST ACHIEVEMENT CARD"
},{
    achievement_id: 4,
    title: "TEST ACHIEVEMENT 4",
    points: 1048,
    description: "TEST ACHIEVEMENT CARD"
}];

var acheivementAchieved = [{
    achievement_id: 1,
    student_id: 123,
    date_achieved: "2017/06/29",
    total_points: 256
},{
    achievement_id: 2,
    student_id: 123,
    date_achieved: "2017/06/29",
    total_points: 768
},{
    achievement_id: 3,
    student_id: 123,
    date_achieved: "2017/06/29",
    total_points: 1280
}];

var account = [{
    user_id: 123,
    'name': "Bryan",
    "Username": "bryan_tsx",
    "email":"qtxbrya@gmail.com"
}];

var studAccount = [{
    stud_id: 123,
    user_id: 123,
    date_of_birth: "1998-12-29",
    school: "NYP"
}];

var teachAccount = [{
    teach_id: 1,
    user_id: 123,
    organisation: "NYP organisation"
}]

var quizID = new Array();
var tempQuizID;
var today = new Date();

var clientChoiceQuiz25 = [2, "Dumb", "Dumb"];
var hostedChoiceQuiz345 = [2, "Dumb", "Dumb"];
// function changeContent(){
//     document.getElementById('type').innerHTML =
// }
//

function displayClientCompletedQuestion(){

    var index;
    for(var i =0;i<client_completed_quizzes.length;i++){


        if(client_completed_quizzes.quiz_id == tempQuizID){

            index = i;
        }
    }
    document.getElementById('type').innerHTML = client_completed_quizzes[index].quiz_type.substr(0,1);
    document.getElementById('quiz-name').innerHTML = client_completed_quizzes[index].quiz_title;
    var date = new Date(client_completed_quizzes[index].date_created.substr(0,4), client_completed_quizzes[index].date_created.substr(5,2), client_completed_quizzes[index].date_created.substr(8,2));
    var duration = dateDiffInDays(today,date);
    var printed;
    if(duration < 0){
        printed = "( " + -duration + ' days ago )';
    }else if (duration == 0){
        printed = "( Just now )";
    }
    document.getElementById('date').innerHTML = date.toDateString();
    document.getElementById('days').innerHTML = printed;
    document.getElementById('question-no').innerHTML = questionQuiz25.length;

    for(var j=0;j<questionQuiz25.length;j++){

        var li = document.createElement('li');

        var title = document.createElement('div');
        title.className = "collapsible-header";

        console.log(questionQuiz25[j].prompt);
        title.innerHTML = questionQuiz25[j].prompt;
        li.appendChild(title);

        var body = document.createElement('div');
        body.className = "collapsible-body";

        console.log("Choice ans: " + clientChoiceQuiz25[j]);
        console.log("quiz ans: " + questionQuiz25[j].solution);
        console.log(clientChoiceQuiz25[j] === questionQuiz25[j].solution);

        if(clientChoiceQuiz25[j] === questionQuiz25[j].solution){
            body.innerHTML = "Choice is: " + clientChoiceQuiz25[j] +
            "<br> Answer is: " + questionQuiz25[j].solution + "<br>" + "Tick";

        }else if (clientChoiceQuiz25[j] != questionQuiz25[j].solution){
            body.innerHTML = "Choice is: " + clientChoiceQuiz25[j] +
            "<br> Answer is: " + questionQuiz25[j].solution + "<br>" + "Cross";
        }

        li.appendChild(body);
        document.getElementsByClassName("collapsible")[0].appendChild(li);
    }


}

function download(){

var ep=new ExcelPlus();

var book = ep.createFile("Book1");
book.write({"cell": "A1", "content":"Questions"});

book.write({"cell": "A2", "content": questionQuiz25[0].prompt});
for(var i =2;i<=questionQuiz25.length;i++){
    var index = i - 1;
    book.write({ "cell":"A" + (i+1), "content":questionQuiz25[index].prompt});
    book.write({"cell": "D" + (i+1), "content":questionQuiz25[index].solution});
}

book.saveAs("demo.xlsx");

}

function displayClientCompletedQuiz(client_completed_quizzes){

  for(var i =0;i<client_completed_quizzes.length;i++){
      var records = document.createElement('tr');
      records.className = 'records';
      var cell = document.createElement('td');
      var obj = client_completed_quizzes[i];
      // cell.innerHTML = obj.quiz_type.substr(0,1);

      records.appendChild(cell);

      var cell1 = document.createElement('td');
      cell1.innerHTML = obj.quiz_title;
      records.appendChild(cell1);

      var dateCreate = new Date(obj.date_created.substr(0,4),(obj.date_created.substr(5,2)-1), obj.date_created.substr(8,2));

      var duration_created = dateDiffInDays(today, dateCreate);
      var days;
      if(duration_created < 0){
          days = -duration_created + " days ago";
      }else if (duration_created ==0){
          days = "Just now";
      }else{
          days = duration_created + " later";
      }
      console.log(days);

      var cell2 = document.createElement('td');
      cell2.innerHTML = days;
      records.appendChild(cell2);

      var cell3 = document.createElement('td');
      cell3.innerHTML = obj.quiz_rating;
      records.appendChild(cell3);

      quizID[i] = obj.quiz_id;
      console.log(quizID[i]);

      var cell4 = document.createElement('td');
      var button  = document.createElement('a');
      button.className = "btn";
      button.id = obj.quiz_id;
      button.innerHTML="Host";
      button.setAttribute('href', '/host?quizId=' + obj.quiz_id);
      cell4.appendChild(button);

      //  $('.btn').click(function(){
      //     tempQuizID = button.id;
      //     console.log(tempQuizID);
      //     location.href = 'report.pug'
      // });
      records.appendChild(cell4);
      document.getElementById("testTable").appendChild(records);
  }
}


function displayClientHostedQuiz(hostedQuiz){
  console.log("HERE IS THE HOSTED QUIZ");
  console.log(hostedQuiz);
    for(var i = 0;i<hostedQuiz.length;i++){

        var records = document.createElement('tr');
        records.className = "records";

        var cell = document.createElement('td');

        var obj = hostedQuiz[i];
        // cell.innerHTML = obj.quiz_type.substr(0,1);
        records.appendChild(cell);

        var cell1 = document.createElement('td');
        cell1.innerHTML = obj.quiz_title;
        records.appendChild(cell1);

         var dateCreate = new Date(obj.date_created.substr(0,4),(obj.date_created.substr(5,2)-1), obj.date_created.substr(8,2));


        var duration_created = dateDiffInDays(today, dateCreate);
        var days;
        if(duration_created < 0){
            days = -duration_created + " days ago";
        }else if (duration_created ==0){
            days = "Just now";
        }else{
            days = duration_created + " later";
        }
        console.log(days);

        var cell2 = document.createElement('td');
        cell2.innerHTML = days;
        records.appendChild(cell2);

        var cell3 = document.createElement('td');
        cell3.innerHTML = obj.quiz_rating;
        records.appendChild(cell3);

        quizID[i] = obj.quiz_id;
        console.log(quizID[i]);

        var cell4 = document.createElement('td');
        var button  = document.createElement('a');
        button.className = "btn";
        // button.onclick = function(){
        //     location.href = 'HostReport.pug';
        // }
        button.id = obj.quiz_id;
        button.innerHTML="Host";
        button.setAttribute('href', '/host?quizId=' + obj.quiz_id);
        cell4.appendChild(button);

        //  $('.btn').click(function(){
        //     tempQuizID = button.id;
        //     console.log(tempQuizID);
        // });
        records.appendChild(cell4);

        document.getElementById("tableToExcel").appendChild(records);

    }
}

function displayAchievement(){

    var percentage = (acheivementAchieved.length/achievement.length) * 100;
    document.getElementsByClassName('stat-title').innerHTML = percentage;
}

function displayHostedQuestion(){

     var index;
    for(var i =0;i<hostedQuiz.length;i++){


        if(hostedQuiz.quiz_id == tempQuizID){

            index = i;
        }
    }

    document.getElementsByClassName('live').innerHTML = hostedQuiz[index].quiz_type.substr(0,1);
    document.getElementById('quiz-name').innerHTML = hostedQuiz[index].quiz_title;
    document.getElementById('question_no').innerHTML = hosted_question345.length;
    var date = new Date(hostedQuiz[index].date_created.substr(0,4), hostedQuiz[index].date_created.substr(5,2), hostedQuiz[index].date_created.substr(8,2));
    var duration = dateDiffInDays(today,date);


    console.log(duration);
    var printed;

    if(duration < 0){
        printed = "( " + -duration + " days ago )";
        document.getElementById('days').innerHTML = printed;
    }else if (duration == 0){
        printed = "( Just now )";
        document.getElementById('days').innerHTML = printed;
    }
    document.getElementById('date').innerHTML = date.toDateString();
    console.log(printed);


    for(var j =0;j<hosted_question345.length;j++){

        var li = document.createElement('li');

        var title = document.createElement('div');
        title.className = "collapsible-header";

        console.log(hosted_question345[j].prompt);
        title.innerHTML = hosted_question345[j].prompt;
        li.appendChild(title);

        var body = document.createElement('div');
        body.className = "collapsible-body";

        console.log("Choice ans: " + hostedChoiceQuiz345[j]);
        console.log("quiz ans: " + hosted_question345[j].solution);
        console.log(clientChoiceQuiz25[j] === hosted_question345[j].solution);

        if(hostedChoiceQuiz345[j] === hosted_question345[j].solution){
            body.innerHTML = "Choice is: " + hostedChoiceQuiz345[j] +
            "<br> Answer is: " + hosted_question345[j].solution + "<br>" + "Tick";

        }else if (hostedChoiceQuiz345[j] != hosted_question345[j].solution){
            body.innerHTML = "Choice is: " + hostedChoiceQuiz345[j] +
            "<br> Answer is: " + hosted_question345[j].solution + "<br>" + "Cross";
        }

        li.appendChild(body);
        document.getElementsByClassName("collapsible")[0].appendChild(li);
    }


}

function displayProfile(clientProfile){
    var user_id = account[0].user_id;
    var newArr = [];
    var newStudentArr = [];
    var teachIndex;

    document.getElementById('name').innerHTML = clientProfile.name;
    document.getElementById('complete_quiz').innerHTML = clientProfile.completedQuiz.length; //TODO: Need to get completed quiz from database

    //NOTE: WHAT IS THIS FOR?
    for(i =0;i<client_completed_quizzes.length;i++){

        if(client_completed_quizzes[i].user_id === user_id){

            newArr[i] = client_completed_quizzes[i];

        }
    }

    document.getElementById('numOfQuiz').innerHTML = clientProfile.completedQuiz.length;
    document.getElementById('email').innerHTML = clientProfile.email;

    for(j=0;j<studAccount.length;j++){

        if(studAccount[j].user_id === user_id){

            newStudentArr.push(studAccount[j]);
        }
    }

    for(z = 0;z<teachAccount.length;z++){

        if(teachAccount[z].user_id === user_id){
            teachIndex = z;
        }
    }

    document.getElementById('school').innerHTML = clientProfile.school;
    document.getElementById('user_name').innerHTML =  clientProfile.username;
    document.getElementById('DOB').innerHTML = clientProfile.date_of_birth;
    document.getElementById('emailAdd').innerHTML = clientProfile.email;
    // document.getElementById('organisation').innerHTML = teachAccount[teachIndex].organisation;

    displayClientCompletedQuiz(clientProfile.completedQuiz);
    displayClientHostedQuiz(clientProfile.hostedQuiz);
    displayAchievement();
}
var _MS_PER_DAY = 1000* 60* 60 * 24;
/* a is the value that you want to minus
   b is the value that you use to minus
   */
function dateDiffInDays(a, b){
    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1)/_MS_PER_DAY);
}
