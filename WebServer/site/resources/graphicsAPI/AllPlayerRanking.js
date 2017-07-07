/*
  Serves as a factory for the PlayerRanking class,
  generates the ranking for all the players to display

  Takes in an array of player Objects, each has properties
  name, score, correctAnswers, profilePic, answerStreak;
  and the positionData with properties paddingX, paddingY, maxHeight, minIndivHeight
  and lastly a boolean value for the minimalistic version

  Also contains all the animations for the PlayerRankings

  Author: Jin Kuan
*/
class AllPlayerRanking extends DisplayElement {
  constructor(resources, playerData, positionData, min) {
    super();
    this._min = min;
    this._playerRankings = [];
    if(playerData) {
      this.data = playerData;
    }
  }

  fadeIn() {

  }

  slideUp() {

  }

  set data(playerData) {
    for(let i = 0; i < playerData.length; i++) {
      let playerDisplay = new PlayerRanking(resources, playerData[i], positionData, this._min);
      playerDisplay.y = i * (playerDisplay.height + paddingY);
      this._playerRankings.push(playerDisplay);
      this._container.addChild(playerDisplay);
    }
  }
}
