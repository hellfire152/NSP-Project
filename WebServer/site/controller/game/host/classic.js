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
      //show a get ready message
      break;
    }
    case C.GAME_RES.ANSWER_CHOSEN: {
      //updata answersObj
      if(answersObj[response.answer] === undefined)
        answersObj[response.answer] = 0;
      answersObj[response.answer]++;

      //update display
      break;
    }
    case C.GAME_RES.ROUND_END: {
      //show the results on screen
      break;
    }
    case C.GAME_RES.NEXT_QUESTION: {
      //create a div for the question
      let currentQuestionDiv = document.createElement('div');
      currentQuestionDiv.id = 'current-question';
      currentQuestionDiv.appendChild(document.createTextNode(response.question.prompt));

      if(question.type == 0) {  //MCQ question
        //a ordered list for the choices...
        let choicesOl = document.createElement('ol');
        choicesOl.id = 'choices-list';

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
          choicesOl.appendChild(choicesLi);
        }

        //add to the display
        currentQuestionDiv.appendChild(choicesOl);
        document.body.appendChild(currentQuestionDiv);
      } else {  //Short answer question

      }
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
  firstQuestion = false;
}
