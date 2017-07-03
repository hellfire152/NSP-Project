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
      updateResponseDisplay(answersObj);
      break;
    }
    case C.GAME_RES.ROUND_END: {
      displayResults(response.roundEndResults);
      break;
    }
    case C.GAME_RES.NEXT_QUESTION: {
      loadQuestion(response.question);
      break;
    }
    case C.GAME_RES.GAME_END: {
      //from common
      showTitlesAndAchievements(response.titlesAndAchievenments);
      initEndScene();
      initRatingScene();

      displayGameEnd(response.roundEndResults);
      break;
    }
    default: {
      console.log('AppServer to User GAME_RES value is ' +response.game +' not a preset case!');
    }
  }
}

function updateResponseDisplay(answersObj) {
  if(p.currentScene !== 'answering') swapScene('answering');
  let data = {
    'labels' : [],
    'values' : []
  };
  for(let answer in answersObj) {
    if(answersObj.hasOwnProperty(answer)) {
      data.labels.push(answer);
      data.values.push(answersObj[answer]);
    }
  }
  let barGraph = new BarGraph(resources, data, {
    'width': WIDTH,
    'height' : HEIGHT / 2,
    'paddingX' : 5,
    'paddingY' : 5
  });
  p.answering.removeChild(p.answering.barGraph);
  p.answering.barGraph = barGraph;
  p.answering.addChild(barGraph);
}

//same as play, but with the buttons/textfield disabled.
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
    timerEnd = () => {};
  } else {  //short answer
    p.shortAnswerTextField.reset();
    p.shortAnswerTextField.visible = true;
    timerEnd = () => {};
  }
  p.questionDisplay.text = question.prompt;
  setTimeout(timerEnd, question.time * 1000);
  swapScene('answering');
}

//same as play for now
function displayGameEnd(response) {
  //shows two scenes, first is the ranking, next the titles/achievements
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
