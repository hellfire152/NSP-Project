/*
  handleGame function for the classic gamemode (HOST)
*/
const MCQ_NO_TO_LETTER = {
  8: 'A',
  4: 'B',
  2: 'C',
  1: 'D'
}
const COUNTER_TO_MCQ = {
  0 : 8,
  1 : 4,
  2 : 2,
  3 : 1
}
var answersObj = {};
var currentQuestion;
var firstQuestion = true;
console.log('HOST: Loaded: classic gamemode handler!');
function handleGame(response) {
  console.log('HOST: Handling game response!');
  switch(response.game) {
    case C.GAME_RES.ANSWER_CHOSEN: {
      if(answersObj[response.answer] === undefined)
        answersObj[response.answer] = 0;
      answersObj[response.answer]++;
      updateResponseDisplay();
      break;
    }
    case C.GAME_RES.ROUND_END: {
      clearAnsDiv();
      console.log(response.roundEndResults);
      break;
    }
    case C.GAME_RES.NEXT_QUESTION: {
      if(firstQuestion) clearBody();
      clearGameArea();

      loadQuestion(response.question);
      break;
    }
  }
}

function updateResponseDisplay() {
  clearAnsDiv();
  if(currentQuestion.type == 0) { //MCQ
    for(let i = 0; i < 4; i++) {
      let ansSpan = document.createElement('span');
      ansSpan.appendChild(document.createTextNode(
        "  " +question.choices[i] +" x " +answersObj[COUNTER_TO_MCQ[i]] +"  "
      ));
    }
  } else {
    let uniqueAnsArr = Object.keys(answersObj);
    uniqueAnsArr.forEach(ans => {
      let ansSpan = document.createElement('span');
      ansSpan.appendChild(document.createTextNode(
        "  " +ans +" x " +answersObj[ans] +"  "
      ));
    });
  }
  document.getElementById('ans').appendChild(ansSpan);
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
    //create MCQ display
    console.log("HOST QUESTION HANDLER: MCQ");
    for(let i = 0; i < 4; i++) {
      let ansSpan = document.createElement('span');
      ansSpan.appendChild(document.createTextNode("  " +question.choices[i] +" x 0" +"  "));
      //append to ansNode
      ansNode.appendChild(ansSpan);
    }
  } else {  //short answer question
    ansNode.appendChild(document.createTextNode('Responses so far...'));
  }

  //adding to the document
  questionDiv.appendChild(promptNode);
  questionDiv.appendChild(ansNode);
  document.getElementById('game').appendChild(questionDiv);
}

function clearAnsDiv() {
  document.getElementById('ans').innerHTML = "";
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
