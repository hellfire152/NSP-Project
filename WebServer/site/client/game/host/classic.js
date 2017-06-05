/*
  handleGame function for the classic gamemode
*/
console.log('Loaded: classic gamemode handler!');
async function handleGame(response) {
  switch(response) {
    case C.GAME.START: {
      document.getElementById('game').innerHTML = ""; //clear game area


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

  if(question.type == 0) { //if MCQ question
    //create MCQ buttons
    let buttonArr = [];
    for(let i = 0; i < 4; i++) {
      let button = document.createElement('button');
      button.id = 'MCQ-' + MCQ_LETTERS[i];
      button.onclick = function() {
        return function() {
          submitAnswer(0, C.MCQ_LETTERS[i]); //setting the proper onclick function
        }
      };
    }
  } else {  //short answer question
    //create textfiedl
    //let textField =
  }
}

//clears the game area (by settin innerHTML for now)
function clearGameArea() {
  document.getElementById('game').innerHTML = "";
}

//sends the answer to the server
function submitAnswer(type, ans) {
  if (type == 0){
    send({
      'game': C.GAME.SUBMIT_ANSWER,
      'answer': C.MCQ[ans];
    });
  } else {
    send({
      'game': C.GAME.SUBMIT_ANSWER,
      'answer': ans //TODO::Validation against injection attacks
    });
  }
}
