/*
  handleGame function for the classic gamemode (player side)
*/
const MCQ_LETTERS = {
  0: 'A',
  1: 'B',
  2: 'C',
  3: 'D'
}
var firstQuestion = true;
console.log('PLAY: Loaded: classic gamemode handler!');
function handleGame(response) {
  console.log('PLAY: Handling game response!');
  switch(response.game) {
    case C.GAME_RES.GET_READY: {
      document.body.innerHTML = ''; //clear the html body
      document.body.appendChild(app.renderer.view); //add the game view
      swapScene('getReady');
    }
    case C.GAME_RES.NEXT_QUESTION: {
      if(firstQuestion) {
        firstQuestion = false;
      }
      clearGameArea();
      showQuestion(response.question)
      break;
    }
    case C.GAME_RES.ROUND_END: {
      clearGameArea();
      displayResults(response.roundEndResults);
      break;
    }
    case C.GAME_RES.GAME_END: {
      clearGameArea();
      displayGameEnd(response.roundEndResults);
      break;
    }
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
    console.log("QUESTION HANDLER: MCQ");
    //create MCQ buttons
    let buttonArr = [];
    for(let i = 0; i < 4; i++) {
      let button = document.createElement('button');
      button.id = 'MCQ-' + C.MCQ_LETTERS[i];
      button.onclick = (function() {
        return function() {
          submitAnswer(0, C.MCQ_LETTERS[i]); //setting the proper onclick function
        }
      })();
      button.appendChild(document.createTextNode(question.choices[i]));
      ansNode.appendChild(button);
    }
  } else {  //short answer question
    //create textfiedl
    //let textField =
  }
  questionDiv.appendChild(promptNode);
  questionDiv.appendChild(ansNode);
  document.getElementById('game').appendChild(questionDiv);
}

function submitAnswer(type, ans) {
  send({
    'game': C.GAME.SUBMIT_ANSWER,
    'answer': (type == 0)? C.MCQ[ans] : ans
  });
  //disable all buttons
  document.getElementById('ans').childNodes.forEach(button => {
    button.disabled = true;
  });
}

function swapScene(scene) {
  for(let scene in pixiScenes) {  //set all scenes not visible
    if(pixiScenes.hasOwnProperty(scene)) {
      pixiScenes[scene].visible = false;
    }
  }
  pixiScenes[scene].visible = true; //set the specified one to be visible
}
