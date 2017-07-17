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
      break;
    }
    case C.GAME_RES.NEXT_QUESTION: {
      let p = pixiScenes.answering;
      p.answerResponses.visible = false;
      p.questionDisplay.visible = true;
      loadQuestion(response.question);
      swapScene('answering');
      break;
    }
    case C.GAME_RES.RESPONSE_DATA: { //show the responses
      console.log("RESPONSE GET");
      let p = pixiScenes.answering;
      //show responseData on bar graph
      p.answerResponses.data = response.responseData;
      p.answerResponses.visible = true;
      p.questionDisplay.visible = false;
      p.mcqButtonHandler.showSolution(response.solution);

      //update topBar
      let scoreData = response.scoreData[name];
      pixiScenes.topBar.updateCorrect(scoreData.correctAnswers, scoreData.score);
      break;
    }
    case C.GAME_RES.ROUND_END: {
      pixiScenes.answering.mcqButtonHandler.stopShowingSolution();
      let p = pixiScenes.ranking;
      p.allPlayerRanking.data = response.roundEndResults;
      swapScene('ranking');
      break;
    }
    case C.GAME_RES.GAME_END: {
      gameEnd(response);
      break;
    }
    //ADD MORE CASES HERE
    default: {
      console.log(`GAME_RES value is ${response.game}, not a preset case!`);
    }
  }
}

function gameEnd(response) {
  //updating the ranking list
  displayResults(response.roundEndData);
  //showing titles and achievements
  showTitlesAndAchievements(response.titlesAndAchievenments); //in common

  let appView = document.getElementsByTagName('canvas')[0];
  appView.parentNode.removeChild(appView);

  //init ranking
  
}
