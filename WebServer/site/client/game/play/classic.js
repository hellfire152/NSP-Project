/*
  handleGame function for the classic gamemode (player side)
*/
var firstQuestion = true;
console.log('PLAY: Loaded: classic gamemode handler!');
function handleGame(response) {
  console.log('PLAY: Handling game response!');
  switch(response.game) {
    case C.GAME_RES.NEXT_QUESTION: {
      if(firstQuestion) {
        clearBody();
        firstQuestion = false;
      }
      clearGameArea();
      loadQuestion(response.question);
      break;
    }
    case C.GAME_RES.ROUND_END: {
      clearGameArea();
      displayResults(response.roundEndResults);
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

  //creating and initializing timer
  let time = question.time;
  let timerNode = document.createElement('h4');
  timerNode.id = 'timer';
  let timerText = time + " seconds left!";
  timer.appendChild(document.createTextNode(timerText));

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
          button.disabled = true;
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

  //set timer
  let t = setInterval(() => {
    time--;
    timerText.nodeValue = time + ' seconds left!';

    //stop timer if it reaches 0
    if(time <= 0) {
      clearInterval(t);
    }
  });
}

function displayResults(roundEndResults) {
  //create and append a div to hold the results
  let resultsDiv = document.createElement('div');
  resultsDiv.id = 'results';
  document.getElementById('game').appendChild(resultsDiv);

  //create and append a list to hold the results
  let resultsList = document.createElement('ol');
  resultsList.id = 'resultsList';
  resultsDiv.appendChild(resultsList);

  //add player data to the results list
  for(let playerResult of roundEndResults) {
    //create a li for each player
    let playerData = document.createElement('li');

    //format results and append
    playerData.appendChild(document.createTextNode(playerResult.player +'\t'
      + 'Score: ' +playerResult.score +'\t Correct Answers: ' + playerResult.correctAnswers));

    resultsListv.appendChild(playerData);
  }
}

/*
  Clears the body, and adds the game div
*/
function clearBody() {
  let body =  document.getElementsByTagName('body')[0]
  body.innerHTML = "";
  let gameDiv = document.createElement('div');
  gameDiv.id = 'game';
  body.appendChild(gameDiv);
}

//convenience function for clearing the game div
function clearGameArea() {
  document.getElementById('game').innerHTML = "";
}

function createQuestionDiv() {
  let questionDiv = document.createElement('div');
  questionDiv.id = 'question';

  document.getElementById('game')
}

//sends the answer to the server
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
