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
  //allows for swapping via buttons
  pixiScenes.titlesAndAchievenments = new PIXI.Container();
  //updating the ranking list
  displayResults(response.roundEndData);
  //showing titles and achievements
  showTitlesAndAchievements(response.titlesAndAchievenments); //in common
  //initialize rating scene
  initRatingScene();  //in common
  //init end scene
  initEndScene(); //in common

  //defining next and previous page buttons
  //order: ranking -> titlesAndAchievenments -> rating -> end
  let next = new Button(allResources['next-button'].textures, WIDTH / 8, () => {
    if(pixiScenes.currentScene === 'ranking') {
      previous.enable();
      swapScene('titlesAndAchievenments');
    } else if(pixiScenes.currentScene === 'titlesAndAchievenments') {
      swapScene('rating');
    } else if(pixiScenes.currentScene === 'rating') {
      swapScene('end');
      this.disable();
    } else {
      throw new Error(`Cannot go to the next panel, currentScene = ${pixiScenes.currentScene}`);
    }
  }, null);
  let previous = new Button(allResources['previous-button'].textures, WIDTH / 8, () => {
    if(pixiScenes.currentScene === 'end') {
      next.enable();
      swapScene('rating');
    } else if(pixiScenes.currentScene === 'rating') {
      swapScene('titlesAndAchievenments');
    } else if(pixiScenes.currentScene === 'titlesAndAchievenments') {
      swapScene('ranking');
      this.disable();
    } else {
      throw new Error(`Cannot go to the next panel, currentScene = ${pixiScenes.currentScene}`);
    }
  }, null);
  swapScene('ranking');
}
