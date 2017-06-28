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
    this._playerRankings = [];
    for(let i = 0; i < playerData.length; i++) {
      let playerDisplay = new PlayerRanking(resources, playerData[i], positionData, true);
      playerDisplay.y = i * (playerDisplay.height + paddingY);
      this._playerRankings.push(playerDisplay);
      this._container.addChild(playerDisplay);
    }
  }

  fadeIn() {

  }

  slideUp() {

  }
}
