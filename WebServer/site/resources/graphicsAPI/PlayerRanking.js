/*
  Class for each player in the ranking display

  data has attributes name, score, rank, correctAnswers, answerStreak,
  paddingX, paddingY, and profilePic (that one must wait)

  Author: Jin Kuan
*/
class PlayerRanking extends DisplayElement {
  constructor(resources, data, positionData, min) {
    super();
    //creating a background first
    let width = positionData.width - positionData.paddingX * 2;
    let background = new PIXI.Graphics()
      .beginFill(0xbcfdff)
      .drawRect(
        0, 0, width, positionData.height)
      .endFill();
    if(!min) {
      //creating a background first...
      let background = new PIXI.Sprite('/resources/graphics/ui/player-ranking-background');
      background.width = positionData.width;
      background.height = positionData.height;
      //in case I need to access this later
      this._data = data;

      //Creating elements
      //let profilePic = new PIXI.Sprite(new PIXI.Texture(new PIXI.BaseTexture(data.profilePic)));
      let name = new PIXI.Text(data.name);
      let score = new PIXI.Text(data.score);
      let rank = new PIXI.Text(data.rank);
      let correctAnswers = new PIXI.Text(data.correctAnswers + '/' + data.totalQuestions);
      let answerStreakIcon = new PIXI.Sprite(resources['answer-streak-icon'].texture);
      answerStreakIcon.width = answerStreakIcon.height = 40;
      let answerStreakText = new PIXI.Text(data.answerStreak);

      //positioning
      let paddingX = positionData.paddingX,
        paddingY = positionData.paddingY;
      //profilePic is the first from the left...
      //([profilePic.x, profilePix.y] = [paddingX, paddingY]);
      //name is after that, takes the first half of the element
      let profilePic = null; //FOR TESTING ONLY
      name.x = (profilePic)? profilePic.width + paddingX * 2:
        50 + paddingX;
      name.y = paddingY;
      //score is the rightmost on the top row
      score.anchor.set(1, 0);
      score.x = width - paddingX;
      score.y = paddingY;
      //correct answers positioned on the bottom row, right side
      let bottomRow = positionData.height - paddingY;
      correctAnswers.anchor.set(1,1);
      correctAnswers.x = width - paddingX;
      correctAnswers.y = bottomRow;
      //answerStreak on the bottom row, to the left of correctAnswers
      answerStreakIcon.anchor.set(1,1);
      answerStreakText.anchor.set(1,1);
      answerStreakIcon.x = answerStreakText.x = paddingX * 2 + correctAnswers.width;
      answerStreakIcon.y = answerStreakText.y = bottomRow;
      answerStreakText.x += paddingX;

      //add all to container
      this._container.addChild(background,
        name, score, correctAnswers, answerStreakIcon, answerStreakText);
      if(profilePic){
        this._container.addChild(profilePic);
      }
    } else {
      let rank = new PIXI.Text(`#${data.rank}`);
      let name = new PIXI.Text(data.name);
      let score = new PIXI.Text(data.score);

      //positioning (rank -> name -> score)
      name.x = rank.width + positionData.paddingX;
      score.x = name.x + name.width + positionData.paddingX;
      //paddingY
      name.y += positionData.paddingY;
      score.y += positionData.paddingY;
      rank.y += positionData.paddingY;
      //paddingX
      name.x += positionData.paddingX;
      score.x += positionData.paddingX;
      rank.x += positionData.paddingX;

      this._container.addChild(rank, name, score);
    }
  }

  get data() {
    return this._data;
  }
}
