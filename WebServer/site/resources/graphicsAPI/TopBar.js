/*
  Class for the top bar of the game, part of the ui
  This top bar will show the name, number of correct answers.
  current question number, position, and score.

  Author: Jin Kuan
*/
class TopBar {
  constructor(resources, width, name) {
    //initializing variables
    this._width = width;
    this._container = new PIXI.Sprite(resources['topbar-background'].texture);
    this._name = 0;
    this._pixiElements = {};

    //initializing display elements
    let p = this._pixiElements;
    p.name = new PIXI.Text(name);
    p.name.x = 5;
    p.correctAnswers = new PIXI.Text('');
    p.correctAnswers.anchor.set(1, 0);
    p.score = new PIXI.Text('');
    p.score.anchor.set(1, 0);

    this.updateCorrect(0, 0);
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

  get sprite() {
    return this._container;
  }

  get x() {
    return this._container.x;
  }

  get y() {
    return this._container.y;
  }

  set x(a) {
    this._container.x = a;
  }

  set y(b) {
    this._container.y = b;
  }
}
