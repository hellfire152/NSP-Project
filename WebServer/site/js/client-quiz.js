//Sample Data 
var clientQuizQuestions = [{
        question_id: 105,
        quiz_id: 23,
        question_no: 1,
        type: 0,
        prompt: "Question statement 1",
        solution: 2,
        time: 3000
    },

    {
        question_id: 105,
        quiz_id: 23,
        question_no: 2,
        type: 0,
        prompt: "Question statement 2",
        solution: 2,
        time: 3000
    },
    {
        question_id: 105,
        quiz_id: 23,
        question_no: 3,
        type: 0,
        prompt: "Question statement 3",
        solution: 2,
        time: 3000
    }
];

//Sample data for quiz
//Completed client quiz

var Totalquiz = [{
    quiz_id: 23,
    user_id: 1,
    quiz_title: 'NIMAMAMEIYOUMAO',
    quiz_type: 'Classic',
    visibility: 1,
    description: 'quiz description',
    quiz_rating: 3,
    date_created: '2017-06-20T16:00:00.000Z'
}];

function generateQuizQuestion() {
    var total = clientQuizQuestions.length;

    for (var index; index < total; index++) {


        var li = document.createElement('li');
        document.getElementsByClassName('collapsible').appendChild(li);
        var headerDiv = document.createElement('div');
        headerDiv.className = "collapsible-header";
        li.appendChild(headerDiv);
        headerDiv.innerHTML = (index + 1) + clientQuizQuestions[i].prompt;
    }
}