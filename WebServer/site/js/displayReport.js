var quiz = [{
	quiz_id: 23,
	user_id: 1,
	quiz_title: "Blah Blah 1",
	quiz_type : "Classic",
	visibility: 1,
	description: "iahsdoija",
	quiz_rating: 5,
	date_created: "2017-06-15"
},
	{
	quiz_id: 24,
	user_id: 1,
	quiz_title: "Blah Blah 2",
	quiz_type : "Classic",
	visibility: 1,
	description: "iahsdoija",
	quiz_rating: 5,
	date_created: "2017-06-15"
	},

	{
	quiz_id: 25,
	user_id: 1,
	quiz_title: "Blah Blah 3",
	quiz_type : "Classic",
	visibility: 1,
	description: "iahsdoija",
	quiz_rating: 5,
	date_created: "2017-06-15"
	}
]
var questions = [{
	question_id: 105,
	quiz_id: 23,
	question_no: 1,
	type: 0,
	prompt: "1+1 = 2",
	solution: 2,
	time: 30
},{
	question_id: 106,
	quiz_id: 23,
	question_no: 2,
	type: 0,
	prompt: "1+1 = 2",
	solution: 2,
	time: 30
}, {
	question_id: 107,
	quiz_id: 23,
	question_no: 3,
	type: 0,
	prompt: "1+1 = 2",
	solution: 2,
	time: 30
}];


//Not sure workig test data
var hostQuestion = [{
	question_id: 108,
	quiz_id: 26,
	question_no: 1,
	type: 0,
	prompt: "1+1 = 2",
	solution: 2,
	time: 30
},
{
	question_id: 109,
	quiz_id: 26,
	question_no: 2,
	type: 0,
	prompt: "1+1 = 3",
	solution: 2,
	time: 30
}];

var players = [{
	user_id: 1,
	name: "nigel",
	username: "nigelhao_teacher",
	email: "nigel.zch@gmail.com"
},
{
	user_id:2,
	name: "Bryan",
	username: "qtxbryan",
	email:"qtxbryan@gmail.com"
}];
//test data end

var clientAns = [8,2,1];

function displayAttemptedQuestions(){
	for(var i=0;i<questions.length;i++){

	var button = document.createElement('button');
	button.className = "accordion";
	button.innerHTML = ((i+1) + ". " + questions[i].prompt);

	var panel = document.createElement('div');
	panel.className = 'panel';
	var p = document.createElement('p');

	if(clientAns[i] == questions[i].solution){

		p.innerHTML = questions[i].solution + " " + "tick";
	}else{
		p.innerHTML = questions[i].solution + " " + "cross";
	}

	panel.appendChild(p);
	console.log("helo");
	var container = document.getElementsByClassName('accordion-container');
	container[0].appendChild(button);
	container[0].appendChild(panel);


	}
}

function displayHostedQuestion(){

	for(var i =0;i<hostQuestion.length;i++){
		var button = document.createElement('button');
		button.className = "accordion";

		if(hostQuestion[i].solution )
		button.innerHTML((i+1) + ". " + hostQuestion[i].prompt);


	}
}


$(document).ready(displayAttemptedQuestions());


