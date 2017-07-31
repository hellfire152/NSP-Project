/*
  Handles all the functions related to the race gamemode

  Author: Jin Kuan
*/
console.log('PLAY: Loaded: race gamemode handler!');
let pbar;
function handleGame(response) {
  console.log('PLAY: Handling game response!');
  switch(response.game) {
    case C.GAME_RES.GET_READY: {
      document.body.innerHTML = ''; //clear the html body
      document.body.appendChild(app.renderer.view); //add the game view
      swapScene('getReady');

      //load progress bar
      let p = pixiScenes.answering;
      let progressBar = new ProgressBar({
        'width' : WIDTH,
        'height' : 10,
        'maxNo' : response.totalQuestions,
        'startNo' : 0,
        'color' : 0xFF0000
      });
      p.progressBar = progressBar;
      pbar = progressBar;
      //positioning progressBar right above the answering place
      progressBar.y = HEIGHT - p.mcqButtonHandler.height - progressBar.height;
      //add to answering scene
      p.addChild(progressBar.view);
      break;
    }
    case C.GAME_RES.NEXT_QUESTION: {  //first question OR gets the previous question correct
      pixiScenes.answering.progressBar.increment();
      pixiScenes.topBar.updateCorrect(null, response.score); //update top bar

      let p = pixiScenes.answering;

      if(response.question.type) { //MCQ question
        p.mcqButtonHandler.visble = true; //show mcq buttons
        p.mcqButtonHandler.enableAll();
        p.shortAnswerTextField.visible = false;
      } else {  //short answer
        p.shortAnswerTextField.visible = true; //show text field
        p.mcqButtonHandler.visible = false;
      }

      loadQuestion(response.question);
      p.questionDisplay.timer = null; //Don't show timer
      clearTimeout(timeOver);
      swapScene('answering');
      break;
    }
    case C.GAME_RES.WRONG_ANSWER: {  //player gets the question wrong
      console.log("WRONG ANSWER!");
      //disable answering for 3 seconds
      let p = pixiScenes.answering;
      p.mcqButtonHandler.disableAll();
      p.shortAnswerTextField.disable();
      p.questionDisplay.timer = 3;
      //timer to re-enable the answering things
      if(p.mcqButtonHandler.visible) {
        setTimeout(() => {
          p.mcqButtonHandler.enableAll();
          p.questionDisplay.timer = null;
        }, 3000);
      } else {
        setTimeout(() => {
          p.shortAnswerTextField.enable();
          p.questionDisplay.timer = null;
        }, 3000);
      }
      break;
    }
    case C.GAME_RES.ANSWER_CHOSEN: {  //other player gets the question correct
      //test for now
      console.log(`Player ${response.id} answered question ${response.questionNo} correctly!`);

      break;
    }
    case C.GAME_RES.ROUND_END: {  //player finishes
      swapScene('getReady'); //PLACEHOLDER
      console.log(`Waiting for ${response.remainingPlayers} players to finish...`);
      break;
    }
    case C.GAME_RES.PLAYER_FINISH: {  //other player finishes
      console.log(`Player ${response.id} has finished!`);
      break;
    }
    case C.GAME_RES.GAME_END: { //all players finish
      gameEnd(response);
      break;
    }
    //ADD MORE CASES HERE
  }
}
