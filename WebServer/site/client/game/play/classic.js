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
      showQuestion(response.question)
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
