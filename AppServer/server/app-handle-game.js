var C, allRooms, data;
module.exports = async function(input) {
  C = input.C;
  allRooms = input.allRooms;
  data = input.data;
  console.log(data);
  let gamemode = allRooms[data.roomNo].gamemode;
  switch(gamemode) {
    case C.GAMEMODE.CLASSIC: {
      return handleClassic({
        'data': data,
        'C': C,
        'allRooms': allRooms
      });
    }
    case C.GAMEMODE.RACE: {
      return handleRace({
        'data': data,
        'C': C,
        'allRooms': allRooms
      });
    }
    case C.GAMEMODE.TEAM_BATTLE: {
      return handleTeamBattle({
        'data': data,
        'C': C,
        'allRooms': allRooms
      });
    }
    case C.GAMEMODE.TUG_OF_WAR: {
      return handleTugOfWar({
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
