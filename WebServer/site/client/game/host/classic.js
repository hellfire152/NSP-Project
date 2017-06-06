/*
  handleGame function for the classic gamemode
*/
console.log('HOST: Loaded: classic gamemode handler!');
function handleGame(response) {
  console.log('HOST: Handling game response!');
  switch(response.game) {
    case C.GAME_RES.BEGIN_FIRST_QUESTION: {
      clearBody();
      loadQuestion(response.question);
      break;
    }
  }
}

function loadQuestion(question) {
  //create div for question
  let questionDiv = document.createElement('div');
  questionDiv.id = 'question';

  //create h3 node for the question prompt
  let promptNode = document.createElement('h3');
  promptNode.appendChild(document.createTextNode(question.prompt));

  let ansNode = document.createElement('div');
  ansNode.id = 'ans';

  if(question.type == 0) { //if MCQ question
    //create MCQ buttons
    console.log("HOST QUESTION HANDLER: MCQ");
    for(let i = 0; i < 4; i++) {
      let ansDiv = document.createElement('div');
      ansDiv.id = 'MCQ-' + C.MCQ_LETTERS[i];
      ansDiv.appendChild(document.createTextNode("No. of people that chose " +question.choices[i] +": ");
      //append to ansNode
      ansNode.appendChild(ansDiv);
    }

  } else {  //short answer question
    //create textfiedl
    //let textField =
  }

  //adding to the document
  questionDiv.appendChild(promptNode);
  questionDiv.appendChild(ansNode);
  document.getElementById('game').appendChild(questionDiv);
}

//sends the answer to the server
function submitAnswer(type, ans) {
  if (type == 0){
    send({
      'game': C.GAME.SUBMIT_ANSWER,
      'answer': C.MCQ[ans]
    });
  } else {
    send({
      'game': C.GAME.SUBMIT_ANSWER,
      'answer': ans //TODO::Validation against injection attacks
    });
  }
}
