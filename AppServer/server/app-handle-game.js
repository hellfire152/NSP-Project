var C, allRooms, data;
module.exports = async function() {
  switch(data.gamemode) {
    case C.GAMEMODE.CLASSIC: {
      handleClassic({
        'data': data,
        'C': C,
        'allRooms': allRooms
      });
    }
    case C.GAMEMODE.RACE: {
      handleRace({
        'data': data,
        'C': C,
        'allRooms': allRooms
      });
    }
    case C.GAMEMODE.TEAM_BATTLE: {
      handleTeamBattle({
        'data': data,
        'C': C,
        'allRooms': allRooms
      });
    }
    case C.GAMEMODE.TUG_OF_WAR: {
      handleTugOfWar({
        'data': data,
        'C': C,
        'allRooms': allRooms
      });
    }
  }
};

var handleClassic = require('./game/classic-mode.js');
var handleRace = require('./game/race-mode.js');
var handleTeamBattle = require('./game/team-battle-mode.js');
var handleTugOfWar = require('./game/tug-of-war-mode.js');
