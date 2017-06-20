//I'm not doing this until I finish everything else
var data, C, allRooms, conn, sendToServer;
module.exports = function(input) {
  ({data, C, allRooms, conn, sendToServer} = input);
  currentRoom = allRooms[data.roomNo];
  currentPlayer = currentRoom.players[data.id];


  switch(data.game) {
    case C.GAME.START: {

    }
  }
}
