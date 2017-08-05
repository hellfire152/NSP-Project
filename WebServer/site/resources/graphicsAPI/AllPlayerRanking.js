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
    this._positionData = positionData;
    this._resources = resources;
    this._totalQuestions = '?';
    if(playerData) {
      this.data = playerData;
    }
  }

  set data(playerData) {
    let pd = this._positionData;
    let indivDisplayHeight = pd.height / playerData.length;
    if(indivDisplayHeight < pd.minHeight) {
      indivDisplayHeight = pd.height / pd.minHeight;
    }

    if(indivDisplayHeight > pd.maxHeight)
      indivDisplayHeight = pd.maxHeight;
    for(let i = 0; i < playerData.length; i++) {
      let playerDisplay = new PlayerRanking(
        this._resources, playerData[i], {
          'width' : pd.width - pd.paddingX,
          'height': indivDisplayHeight,
          'paddingX' : pd.paddingX,
          'paddingY' : pd.paddingY,
          'totalQuestions' : this._totalQuestions
        }, this._min);
      playerDisplay.y = i * (playerDisplay.height + pd.paddingY);
      playerDisplay.x = pd.paddingX;
      this._playerRankings.push(playerDisplay);
      this._container.addChild(playerDisplay.view);
    }
  }

  set totalQuestions(q) {
    this._totalQuestions = q;
  }
}
