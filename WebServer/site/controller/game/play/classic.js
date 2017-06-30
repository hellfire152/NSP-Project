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
      loadQuestion(response.question);
      break;
    }
    case C.GAME_RES.RESPONSE_DATA: {
      
    }
    case C.GAME_RES.ROUND_END: {
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
  let p = pixiScenes.answering;

  let timerEnd; //callback for when timer ends
  //set both not visible (just in case)
  p.mcqButtonHandler.visible = p.shortAnswerTextField.visible = false;
  if(question.type == 0) { //mcq question
    p.mcqButtonHandler.reset();
    p.mcqButtonHandler.visible = true;
    p.mcqButtonHandler.setNoOfChoices(question.choices.length);
    p.mcqButtonHandler.choices = question.choices;
    p.mcqButtonHandler.enableAll();
    timerEnd = () => {p.mcqButtonHandler.disableAll()};
  } else {  //short answer
    p.shortAnswerTextField.reset();
    p.shortAnswerTextField.enable();
    p.shortAnswerTextField.visible = true;
    timerEnd = () => {p.shortAnswerTextField.disable()};
  }
  p.questionDisplay.text = question.prompt;
  setTimeout(timerEnd, question.time * 1000);
  swapScene('answering');
}

function

function swapScene(scene) {
  for(let scene in pixiScenes) {  //set all scenes not visible
    if(pixiScenes.hasOwnProperty(scene)) {
      pixiScenes[scene].visible = false;
    }
  }
  pixiScenes[scene].visible = true; //set the specified one to be visible
}
