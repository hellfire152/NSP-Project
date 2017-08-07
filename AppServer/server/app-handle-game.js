var C, allRooms, data, conn, sendToServer;
module.exports = async function(input) {
  ({C, allRooms, data, conn, sendToServer, dbConn} = input);
  let gamemode = allRooms[data.roomNo].gamemode;
  switch(gamemode) {
    case C.GAMEMODE.CLASSIC: {
      return handleClassic({
        'data': data,
        'C': C,
        'allRooms': allRooms,
        'conn': conn,
        'sendToServer': sendToServer,
        'dbConn' : dbConn
      });
    }
    case C.GAMEMODE.RACE: {
      return handleRace({
        'data': data,
        'C': C,
        'allRooms': allRooms,
        'conn': conn,
        'sendToServer': sendToServer,
        'dbConn' : dbConn
      });
    }
    default: {
      console.log('Undefined gamemode!');
    }
  }
};

var handleClassic = require('./game/classic-mode.js');
var handleRace = require('./game/race-mode.js');
