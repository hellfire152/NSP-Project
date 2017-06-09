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
    case C.GAME_RES.GAME_END: {
      clearGameArea();
      displayGameEnd(response.roundEndResults);
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
