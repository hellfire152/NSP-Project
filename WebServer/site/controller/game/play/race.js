/*
  Handles all the functions related to the race gamemode

  Author: Jin Kuan
*/
console.log('PLAY: Loaded: race gamemode handler!');
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
        'maxNo' : totalQuestions,
        'startNo' : 0,
        'color' : 0xFF0000
      });
      //positioning progressBar right above the answering place
      progressBar.y = 10 + p.mcqButtonHandler.height;
      //add to answering scene
      p.addChild(progressBar);
      break;
    }
    case C.GAME_RES.NEXT_QUESTION: {  //first question OR gets the previous question correct
      pixiScenes.topBar.updateCorrect(null, score); //update top bar

      let p = pixiScenes.answering;
      if(response.question.type) { //MCQ question
        p.mcqButtonHandler.visble = true; //show mcq buttons
        p.shortAnswerTextField.visible = false;
      } else {  //short answer
        p.shortAnswerTextField.visible = true; //show text field
        p.mcqButtonHandler.visible = false;
      }

      loadQuestion(response.question);
      swapScene('answering');
      break;
    }
    case. C.GAME_RES.WRONG_ANSWER: {  //player gets the question wrong
      console.log("WRONG ANSWER!");
      //disable the mcq buttons for 3 seconds
      let p = pixiScenes.answering;
      p.mcqButtonHandler.disableAll();
      setTimeout(() => {
        p.mcqButtonHandler.enableAll();
      }, 3000);
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
      initRatingScene();
      initEndScene();
      showTitlesAndAchievements(response.titlesAndAchievenments); //in common
      swapScene('ranking');
      //updating the ranking list
      displayResults(response.roundEndData);
      break;
    }
    //ADD MORE CASES HERE
  }
}
