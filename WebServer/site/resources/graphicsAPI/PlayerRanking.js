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
    let background = new PIXI.Graphics()
      .beginFill(0xbcfdff)
      .drawRect(0, 0, positionData.width, positionData.height)
      .endFill();
    if(!min) {
      //in case I need to access this later
      this._data = data;

      //Creating elements
      //let profilePic = new PIXI.Sprite(new PIXI.Texture(new PIXI.BaseTexture(data.profilePic)));
      let name = new PIXI.Text(data.name);
      let score = new PIXI.Text(data.score);
      let rank = new PIXI.Text(data.rank);
      let correctAnswers = new PIXI.Text(data.correctAnswers + '/' + data.totalQuestions);
      let answerStreakIcon = new PIXI.Sprite(resources['answer-streak-icon'].texture);
      let answerStreakText = new PIXI.Text(data.answerStreak)
      //render answerStreakText in the middle of answerStreakIcon
      answerStreakIcon.anchor.set(0.5, 0.5);
      answerStreakText.anchor.set(0.5, 0.5);
      answerStreakIcon.addChild(answerStreakText);

      //positioning
      let paddingX = positionData.paddingX,
        paddingY = positionData.paddingY;
      //profilePic is the first from the left...
      //([profilePic.x, profilePix.y] = [paddingX, paddingY]);
      //name is after that, takes the first half of the element
      name.x = (profilePic)? profilePic.width + paddingX * 3 :
        (data.width - paddingX * 2) / 3;
      name.y = paddingY;
      //score is the rightmost on the top row
      score.anchor.set(1, 0);
      score.x = data.width - paddingX;
      score.y = paddingY;
      //correct answers positioned on the bottom row, right side
      correctAnswers.anchor.set(1,1);
      correctAnswers.x = data.width - paddingX;
      correctAnswers.y = paddingY;
      //answerStreak on the bottom row, to the left of correctAnswers
      answerStreakIcon.anchor.set(1,1);
      answerStreakIcon.y = paddingY;
      answerStreakIcon.x = paddingX * 3 + correctAnswers.width;

      //add all to container
      this._container.addChild(background,
        /*profilePic,*/ name, score, correctAnswers, answerStreakIcon);
    } else {
      let rank = new PIXI.Text(`#${data.rank}`);
      let name = new PIXI.Text(data.name);
      let score = new PIXI.Text(data.score);

      //positioning (rank -> name -> score)
      name.x = rank.width + positionData.paddingX;
      score.x = name.x + name.width + positionData.paddingX;
      //padding
      name.y += positionData.paddingY;
      score.y += positionData.paddingY;
      ran

      this._container.addChild(background, rank, name, score);
    }
  }

  get data() {
    return this._data;
  }
}
