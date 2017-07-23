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
  if(firstQuestion) initHost();
  console.log('HOST: Handling game response!');
  switch(response.game) {
    case C.GAME_RES.GET_READY: {
      document.getElementById('get-ready').style.display = true;
    }
    case C.GAME_RES.ANSWER_CHOSEN: {
      //updata answersObj
      if(answersObj[response.answer] === undefined)
        answersObj[response.answer] = 0;
      answersObj[response.answer]++;

      //update display
      if(S.showLiveResponse) {
        updateDisplay();
      }
      answersObj = {};
      break;
    }
    case C.GAME_RES.RESPONSE_DATA: {
      document.getElementById('current-question').style.display = 'block';
      //clear response list
      document.getElementById('response-list').innerHTML = "";
      //add the response data
      for(let i = 0; i < response.responseData.labels.length; i++) {
        let choiceLi =
          createNode('li', response.responseData.labels[i], 'choice', `choice-${i}`);

        //to show the number of times this choices was chosen
        let noTimesChosenSpan =
          createNode('span', null, 'choice-chosen', `choice-${i}-chosen`);

        noTimesChosenSpan.appendChild(
          document.createTextNode(': \t' + response.responseData.values[i]));
        choiceLi.appendChild(noTimesChosenSpan);
        document.getElementById('response-list').appendChild(choiceLi);
      }
      //show the next button
      let nextButton = createNode('button', 'Next', null, 'next-button');
      nextButton.onclick = () => {
        send({
          'game' : C.GAME.NEXT_ROUND
        });
        document.getElementById('current-question').style.display = 'none';
      }
      document.body.appendChild(nextButton);
      break;
    }
    case C.GAME_RES.ROUND_END: {
      //show the current rankings on screen
      document.getElementById('game-ranking').style.display = 'block';
      document.getElementById('current-question').style.display = 'none';

      //show ranking
      let rankingList = document.getElementById('game-ranking');
      rankingList.innerHTML = "";
      for(let player of response.roundEndResults) {
        let playerLi = document.createElement('div');
        let name = createNode('p', player.name, 'ranking-name', null);
        let score = createNode('p', player.score, 'ranking-score', null);
        let answerStreak = createNode('p', player.answerStreak, 'ranking-streak', null);
        appendMultiple(playerLi, name, score, answerStreak);
        rankingList.appendChild(playerLi);
      }
      answersObj = {}; //clear answersObj for next round
      break;
    }
    case C.GAME_RES.NEXT_QUESTION: {
      document.getElementById('get-ready').style.display = 'none';

      //hide the other divs and show the question one
      let currentQuestionDiv = document.getElementById('current-question');
      //clear the current-question div first
      currentQuestionDiv.innerHTML = "";
      currentQuestionDiv.style.display = 'block';
      document.getElementById('game-ranking').style.display = 'none'
      currentQuestion = response.question;

      //show the question prompt
      currentQuestionDiv.appendChild(
        createNode('h1', 'Current Question:', 'header', 'current-question-text'));
      currentQuestionDiv.appendChild(document.createTextNode(response.question.prompt));

      //a ordered list for the choices...
      let responsesOl = document.createElement('ol');
      responsesOl.id = 'response-list';

      if(response.question.type == 0) {  //MCQ question

        //append a list element for each choice in the question
        let choiceCounter = 0;
        for(let choice of response.question.choices) {
          //create the li element to append to the list
          let choiceLi = createNode('li', choice, 'choice', `choice-${choiceCounter}`);

          //to show the number of times this choices was chosen
          let noTimesChosenSpan =
            createNode('span', null, 'choice-chosen', `choice-${choiceCounter}-chosen`);

          //add to list
          choiceLi.appendChild(noTimesChosenSpan);
          responsesOl.appendChild(choiceLi);
          choiceCounter++;
        }

        //add to the display
        currentQuestionDiv.appendChild(responsesOl);
      }

      document.body.appendChild(currentQuestionDiv);
      break;
    }
    case C.GAME_RES.GAME_END: {
      //show end results

      //top rankings

      //titles and achievements

      //rating
      break;
    }
    default: {
      console.log('AppServer to User GAME_RES value is ' +response.game +' not a preset case!');
    }
  }
}

/**
  Initialize function for the host side
  This creates a div to show the current question and its responses,
  and a ranking div for the game
*/
function initHost() {
  let currentQuestionDiv = document.createElement('div');
  currentQuestionDiv.id = 'current-question';
  firstQuestion = false;

  //init ranking stuff
  let gameRankingDiv = document.createElement('div');
  gameRankingDiv.id = 'game-ranking';

  gameRankingDiv.style.display =
    currentQuestionDiv.style.display = 'none';

  appendMultiple(document.body, gameRankingDiv, currentQuestionDiv);
}

function updateDisplay() {
  console.log(answersObj);
  let question = currentQuestion;
  if(question.type == 0) {  //MCQ
    //edit the field
    for(let i = 0, answer = 8; i < question.choices.length; i++, answer /= 2) {
      let chosenNo = (answersObj[answer] === undefined)? 0 : answersObj[answer];
      let responseSpan = document.getElementById(`choice-${i}-chosen`);
      responseSpan.innerHTML = ""; //clear the responseSpan
      //show the number of people that chose that as their answer
      responseSpan.appendChild(document.createTextNode('\t' + chosenNo));
    }
  } else { //Short answer
    //clear the whole list
    document.getElementById('response-list').innerHTML = "";
    for(let answer in answersObj) {
      if(answersObj.hasOwnProperty(answer)) {
        let responseLi = document.createElement('li');
        let responseText = document.createTextNode(answer);
        let responseNo = document.createTextNode(answersObj[answer]);
        responseText.class += ' response';
        responseNo.class += ' response-no';

        responseLi.appendChild(responseText);
        responseLi.appendChild(responseNo);
        document.getElementById('response-list').appendChild(responseLi);
      }
    }
  }
}
