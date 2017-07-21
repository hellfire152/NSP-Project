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
      break;
    }
    case C.GAME_RES.RESPONSE_DATA: {
      document.getElementById('currentQuestion').style.display = 'block';
      updateDisplay();
      //show the next button
      let nextButton = document.createElement('button');
      nextButton.onclick = () => {
        send({
          'game' : C.GAME.NEXT_ROUND
        });
        document.getElementById('currentQuestion').style.display = 'none';
      }
      nextButton.id = 'next-button';

      break;
    }
    case C.GAME_RES.ROUND_END: {
      //show the current rankings on screen
      document.getElementById('ranking').style.display = 'block';
      document.getElementById('currentQuestion').style.display = 'none';

      //show ranking
      let rankingList = document.getElementById('ranking');
      rankingList.innerHTML = "";
      for(let player of response.roundEndResults) {
        let playerLi = document.createElement('div');
        let name = document.createElement('p');
        name.appendChild(document.createTextNode(player.name));
        name.class += ' ranking-name';

        let score = document.createElement('p');
        score.appendChild(document.createTextNode(player.score));
        score.class += ' ranking-score';

        let answerStreak = document.createElement('p');
        answerStreak.appendChild(document.createTextNode(player.answerStreak));
        answerStreak.class += ' ranking-answer-streak';
      }
      answersObj = {}; //clear answersObj for next round
      break;
    }
    case C.GAME_RES.NEXT_QUESTION: {
      document.getElementById('get-ready').style.display = 'none';

      //hide the other divs and show the question one
      document.getElementById('currentQuestion').style.display = 'block';
      document.getElementById('ranking').style.display = 'none'
      currentQuestion = response.question;

      //create a div for the question
      currentQuestionDiv.appendChild(document.createTextNode(response.question.prompt));

      //a ordered list for the choices...
      let responsesOl = document.createElement('ol');
      responsesOl.id = 'response-list';

      if(question.type == 0) {  //MCQ question

        //append a list element for each choice in the question
        let choiceCounter = 0;
        for(let choice of response.question.choices) {
          //create the li element to append to the list
          let choiceLi = document.createElement('li');
          choiceLi.id = `choice-${choiceCounter}`;
          choiceLi.class = 'choice';
          choiceLi.appendChild(document.createTextNode(choice)); //choice text

          //to show the number of times this choices was chosen
          let noTimesChosenSpan = document.createElement('span');
          let noTimesChosenText = document.createTextNode();
          noTimesChosenText.id = `choice-${choiceCounter}-chosen`;
          noTimesChosenSpan.appendChild(noTimesChosenText);

          //add to list
          choiceLi.appendChild(noTimesChosenSpan);
          responsesOl.appendChild(choicesLi);
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

function initHost() {
  let getReadyDiv = createNode('div', 'Starting game...', null, 'get-ready');

  let currentQuestionDiv = document.createElement('div');
  currentQuestionDiv.id = 'current-question';
  firstQuestion = false;

  //init ranking stuff
  let gameRankingDiv = document.createElement('div');
  gameRankingDiv.id = 'game-ranking';

  gameRankingDiv.style.display = getReadyDiv.style.display =
  currentQuestionDiv.style.display = 'none';

  appendMultiple(document.body, getReadyDiv, rankingDiv);
}

function updateDisplay() {
  if(question.type == 0) {  //MCQ
    //edit the field
    for(let i = 0, answer = 8; i < question.choices.length; i++, answer /= 2) {
      let chosenNo = (answersObj[answer] === undefined)? 0 : answersObj[answer];
      document.getElementById(`choice-${i}-chosen`).nodeValue = chosenNo;
    }
  } else { //Short answer
    //
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
