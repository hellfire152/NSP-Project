var data, C, allRooms, sendToServer, conn;
var currentRoom, currentPlayer;
var common = require('./common.js');
module.exports = async function(input) {
  ({data, C, allRooms, conn, sendToServer} = input);
  currentRoom = allRooms[data.roomNo];
  currentPlayer = currentRoom.players[data.id];

  switch(data.game) {
    case C.GAME.START: {
      //prevent others from joining the room
      currentRoom.joinable = false;
      currentRoom.completedPlayers = [];

      //get the first question
      let question = currentRoom.quiz.questions[0];

      //add a questionCounter to each player
      let players = currentRoom.players;
      for(let player in players) {
        if(players.hasOwnProperty(player)) {
          players[player].score = 0;
          players[player].questionCounter = 0;
          players[player].answerable = true;
          players[player].highestStreak = 0;
        }
      }

      //send first question to everyone in the room 5 seconds after get ready
      setTimeout(() => {
        //set all players answertime
        for(let player in players) {
          if(players.hasOwnProperty(player)) {
            players[player].answerTime = 0;
            players[player].timeStart = Date.now();
          }
        }
        //send the first question
        sendToServer(conn, {
          'game' : C.GAME_RES.NEXT_QUESTION,
          'question': common.removeSolution(
            currentRoom.quiz.questions[0]
          ),
          'sendTo' : C.SEND_TO.ROOM,
          'roomNo': data.roomNo,
          'score' : 0
        });
      }, 5000);

      //send the get ready signal...
      return {
        'game' : C.GAME_RES.GET_READY,
        'roomNo' : data.roomNo,
        'sendTo' : C.SEND_TO.ROOM,
        'totalQuestions' : currentRoom.quiz.questions.length,
        'players' : currentRoom.players
      }
    }
    case C.GAME.SUBMIT_ANSWER: {
      if(currentPlayer.answerable) {
        let question = currentRoom.quiz.questions[currentPlayer.questionCounter];

        let correct = common.checkCorrectAnswer(question, data.answer);

        if(correct) {
          currentPlayer.correctAnswers++;
          //get time difference
          let timeDiff = (Date.now() - currentPlayer.timeStart) / 1000;
          if(currentPlayer.answerTime === undefined)
            currentPlayer.answerTime = 0;
          currentPlayer.answerTime += timeDiff;

          currentPlayer.answerStreak++;
          if(currentPlayer.answerStreak > currentPlayer.highestStreak)
            currentPlayer.highestStreak = currentPlayer.answerStreak;

          //calculate score
          let reward = common.getReward(currentRoom,
            currentRoom.quiz.questions[currentPlayer.questionCounter]);

          //add score
          console.log(currentPlayer);
          console.log(common.calculateScore(
            reward, currentPlayer.timeStart, Date.now(), currentPlayer.answerStreak));
          console.log(currentPlayer.score + common.calculateScore(
                      reward, currentPlayer.timeStart, Date.now(), currentPlayer.answerStreak));
          currentPlayer.score += common.calculateScore(
            reward, currentPlayer.timeStart, Date.now(), currentPlayer.answerStreak);

          currentPlayer.answerable = true;  //just in case
          currentPlayer.questionCounter++;

          //finished the last question
          if(currentPlayer.questionCounter >= currentRoom.quiz.questions.length) {
            currentPlayer.completed = true;
            currentPlayer.answerable = false; //do not process answer submits anymore
            currentRoom.completedPlayers.push(data.id);
            if(currentRoom.completedPlayers.length >= currentRoom.playerCount) {
              //get time to finish for every player
              let speed = {};
              for(let player in currentRoom.players) {
                if(currentRoom.players.hasOwnProperty(player)) {
                  speed[player] = currentRoom.players.answerTime;
                }
              }
              let ta = common.calculateTitles(currentRoom);

              deleteUnnecessary(currentPlayer);
              return {  //if all players completed
                'game': C.GAME_RES.GAME_END,
                'titlesAndAchievenments' : ta,
                'roundEndResults' : common.roundEndResults(currentRoom.players, 'answerTime'),
                'speed' : speed,
                'sendTo': C.SEND_TO.ROOM,
                'roomNo': data.roomNo
              }
            } else {  //send player finish event
              deleteUnnecessary(currentPlayer);
              sendToServer(conn, {
                'game': C.GAME_RES.PLAYER_FINISH,
                'completedPlayers' : currentRoom.completedPlayers,
                'sendTo': C.SEND_TO.ROOM_EXCEPT_SENDER,
                'sourceId': data.id,
                'roomNo': data.roomNo,
                'id': data.id
              });
            }

            return {  //send finish message to player
              'game': C.GAME_RES.ROUND_END,
              'scoreData' : {
                'score' : currentPlayer.score,
                'time' : currentPlayer.answerTime
              },
              'completedPlayers' : currentRoom.completedPlayers,
              'remainingPlayers' : Object.keys(currentRoom.players).length
                - currentRoom.completedPlayers.length,
              'sendTo': C.SEND_TO.USER,
              'targetId': data.id
            }
          } else {  //player hasn't finished
            //send correct answer event to everybody else
            sendToServer(conn, {
              'game': C.GAME_RES.ANSWER_CHOSEN,
              'sendTo': C.SEND_TO.ROOM_EXCEPT_SENDER,
              'roomNo': data.roomNo,
              'id': data.id,
              'questionNo' : currentPlayer.questionCounter + 1,
              'sourceId': data.id
            });
            return sendNextQuestion(currentRoom, currentPlayer, data);
          }
        } else {  //wrong answer
          currentPlayer.wrongAnswers++;
          currentPlayer.answerStreak = 0;
          if(currentPlayer.answerable) {
            currentPlayer.answerable = false;
            currentPlayer.timer = setTimeout(() => {  //3 second penalty on wrong answer
              currentPlayer.answerable = true;
            }, 3000);
          }
          return {
            'game': C.GAME_RES.WRONG_ANSWER,
            'sendTo': C.SEND_TO.USER,
            'targetId': data.id
          }
        }
      } else {  //cannot answer
        return {
          'err': C.ERR.CANNOT_ANSWER,
          'sendTo': C.SEND_TO.USER,
          'targetId': data.id
        }
      }
    }
    default : {
      console.log(`RACE MODE: GAME value is ${response.game}, not a preset case!`);
    }
    //ADD MORE CASES HERE
  }
}

/*
  Version of sendQuestion for race mode
*/
function sendNextQuestion(currentRoom, currentPlayer, data) {
  currentPlayer.answerable = true;

  //set timer for time taken to a correct answer
  currentPlayer.timeStart = Date.now();

  return {
    'game': C.GAME_RES.NEXT_QUESTION,
    'score' : currentPlayer.score,
    'sendTo': C.SEND_TO.USER,
    'question': common.removeSolution(
      currentRoom.quiz.questions[currentPlayer.questionCounter]
    ),
    'roomNo': data.roomNo,
    'targetId' : data.id
  }
}

function deleteUnnecessary(currentPlayer) {
  delete currentPlayer.answerStreak;
  delete currentPlayer.timeStart;
  delete currentPlayer.answerable;
  delete currentPlayer.questionCounter;
  delete currentPlayer.completed;
  currentPlayer.answerTime =
    Math.round((currentPlayer.answerTime + 0.00001) * 100) / 100; //2 d.p.
}
