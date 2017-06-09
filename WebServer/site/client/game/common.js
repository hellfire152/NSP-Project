//clears the game area (by settin innerHTML for now)
function clearGameArea() {
  document.getElementById('game').innerHTML = "";
}

function clearBody(){
  let body = document.getElementsByTagName('body')[0];
  body.innerHTML = "";
  //add game div back in
  let gameDiv = document.createElement('div');
  gameDiv.id = 'game';
  body.appendChild(gameDiv);
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
    //let playerResult = roundEndResults[i];
    //create a li for each player
    let playerData = document.createElement('li');

    //format results and append
    playerData.appendChild(document.createTextNode('Id: ' +playerResult.player +'\t'
      + 'Score: ' +playerResult.score +'\t Correct Answers: ' + playerResult.correctAnswers));

    resultsList.appendChild(playerData);
  }
}

function displayGameEnd(roundEndResults) {
  //append a big GAME END at the start
  let endHeader = document.createElement('h1');
  endHeader.appendChild(document.createTextNode('GAME END'));
  let body = document.getElementsByTagName('body')[0];
  body.insertBefore(endHeader, body.firstChild);

  //using displayResults to make it easier on me
  displayResults(roundEndResults);
}

function showQuestion(question) {
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
  timerNode.appendChild(document.createTextNode(timerText));

  let ansNode = document.createElement('div');
  ansNode.id = 'ans';

  if(question.type == 0) { //if MCQ question
    console.log("QUESTION HANDLER: MCQ");
    //create MCQ buttons
    let buttonArr = [];
    for(let i = 0; i < 4; i++) {
      let button = document.createElement('button');
      button.id = 'MCQ-' + MCQ_LETTERS[i];
      button.onclick = (function() {
        return function() {
          submitAnswer(0, MCQ_LETTERS[i]); //setting the proper onclick function
          button.disabled = true;
        }
      })();
      button.appendChild(document.createTextNode(question.choices[i]));
      ansNode.appendChild(button);
    }
  } else {  //short answer question
    //create prompt for the textfield
    let prompt = document.createElement('p');
    prompt.appendChild(document.createTextNode('Type your answer!'));
    ansNode.appendChild(prompt);

    //create Short Answer text field
    let textfield = document.createElement('input');
    textfield.type = text;
    textfield.id = 'short-ans';
    ansNode.appendChild(prompt);

    let shortAns = "";
    setOnKeyPress(e => {
      let event = window.event ? window.event : e;
      switch (e.which){
        case 13: { //ENTER key
          textfield.disabled = true;
          clearKeyPress();  //stop taking input
          //submit answer
          send({
            'game': C.GAME.SUBMIT_ANSWER,
            'answer': shortAns
          });
          break;
        }
        default: {  //all other keys
          shortAns += event.which;
          textfield.value = String.fromCharCode(shortAns);
          break;
        }
      }
    });
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

function setOnKeyPress(callback) {
  document.onkeypress = callback;
}

function clearKeyPress() {
  document.onkeypress = undefined;
}
