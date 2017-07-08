/*
  Class for the top bar of the game, part of the ui
  This top bar will show the name, number of correct answers.
  current question number, position, and score.

  Author: Jin Kuan
*/
class TopBar extends DisplayElement {
  constructor(resources, width, height, name) {
    super();
    //initializing variables
    this._width = width;
    this._height = height;
    this._background = new PIXI.Graphics()
      .beginFill(0xFFFFFF)
      .drawRect(0, 0, width, height)
      .endFill();

    this._pixiElements = {};

    //initializing display elements
    let p = this._pixiElements;
    p.name = new PIXI.Text(name);
    p.correctAnswers = new PIXI.Text('');
    p.correctAnswers.anchor.set(1, 0);
    p.score = new PIXI.Text('');
    p.score.anchor.set(1, 0);

    //positioning
    p.name.x = 5;
    p.score.x = width - 10;
    p.correctAnswers.x = width - p.score.width - 20;

    this.updateCorrect(0, 0);
    this._container.addChild(this._background);
    this._container.addChild(p.name);
    this._container.addChild(p.correctAnswers);
    this._container.addChild(p.score);
  }

  updateCorrect(correctAnswers, score) {
    let p = this._pixiElements;
    //setting text
    p.correctAnswers.text = `Correct Answers: ${correctAnswers}`;
    p.score.text = `Score: ${score}`;
    //correct positioning
    p.score.x = this._width - 5;
    p.correctAnswers.x = p.score.x - p.score.width - 5;
  }
}
