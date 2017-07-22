var C, allRooms, data, conn, sendToServer;
module.exports = async function(input) {
  ({C, allRooms, data, conn, sendToServer} = input);
  let gamemode = allRooms[data.roomNo].gamemode;
  switch(gamemode) {
    case C.GAMEMODE.CLASSIC: {
      return handleClassic({
        'data': data,
        'C': C,
        'allRooms': allRooms,
        'conn': conn,
        'sendToServer': sendToServer
      });
    }
    case C.GAMEMODE.RACE: {
      return handleRace({
        'data': data,
        'C': C,
        'allRooms': allRooms,
        'conn': conn,
        'sendToServer': sendToServer
      });
    }
    default: {
      console.log('Undefined gamemode!');
    }
  }
};

var handleClassic = require('./game/classic-mode.js');
var handleRace = require('./game/race-mode.js');
