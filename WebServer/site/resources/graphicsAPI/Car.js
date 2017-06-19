/*
  Class that takes in the car textures, and returns a PIXI Container
  that includes the car + the engine sprites.

  Has functions for starting and stopping

  Author: Jin Kuan
*/
class Car {
  constructor(textures, width) {
    this._textures = textures;
    //initializing various variables that will be used
    this.container = new PIXI.Container();
    this._ticker = new PIXI.ticker.Ticker();
    this._ticker.autoStart = false;
    this._ticker.stop();
    this._speed = 0;
    this._animations = {};

    //add all frames for driving
    this._animations['car-body'] = textures['car-body'];
    this._animations['car-driving'] = [];
    for(let i = 0; i < 7; i++) {
      this._animations['car-driving'].push(textures['car-driving']['driving' + i + '.png']);
    }
    //frames for engine fireup
    this._animations['engine-fireup'] = [];
    for(let i = 0; i < 6; i++) {
      this._animations['engine-fireup'].push(textures['engine-fireup']['fire' + i + '.png']);
    }
    //frames for engine running
    this._animations['engine-firing'] = [];
    for(let i = 0; i < 5; i++) {
      this._animations['engine-firing'].push(textures['engine-firing']['firing' + i + '.png']);
    }
    this._animations['engine-firedown'] = this._animations['engine-fireup'].reverse();

    //initialize all the components
    this._carBody = new PIXI.extras.AnimatedSprite(this._animations['car-driving']);
    this._engine = new PIXI.extras.AnimatedSprite(this._animations['engine-fireup']);
    this._engine.visible = false;

    //set anchors
    this._carBody.anchor.set(0, 0.5);
    this._engine.anchor.set(0, 0.5);

    //set positioning
    this._engine.x = this._carBody.width - 3;
    this._engine.y = 2;

    //add to container
    this.container.addChild(this._carBody);
    this.container.addChild(this._engine);

    //setting variables for scaling
    this._originalWidth = this.container.width;
    this._originalHeight = this.container.height;

    this.scaleToWidth(width);
  }

  //engine starting animation
  start() {
    if(!this._started) {
      //reset ticker
      this._ticker.remove(this._decelerateTickerFunction);
      this._ticker.remove(this._accelerateTickerFunction);

      //swap to driving animation sprite
      this._carBody.loop = true;

      //accelaration
      this._accelerateTickerFunction = Car._accelerate(this);
      this._ticker.add(this._accelerateTickerFunction);
      this._ticker.start();

      //engine firing up animation
      this._engine.loop = false;
      this._engine.visible = true;
      this._engine.textures = this._animations['engine-fireup'];
      this._engine.onComplete = (function(car) {
        return function(){
          //swap to firing loop once complete
          car._engine.stop();
          car._engine.textures = car._animations['engine-firing'];
          car._engine.loop = true;
          car._engine.gotoAndPlay(0);
          car._engine.onComplete = null;
        };
      })(this);
      this._engine.play();
      this._started = true;
    }
  }

  //engine stopping animation
  stop() {
    if(this._started) {
      //reset ticker
      this._ticker.remove(this._decelerateTickerFunction);
      this._ticker.remove(this._accelerateTickerFunction);

      //stop loop
      this._carBody.loop = true;

      //engine dying
      this._engine.onLoop = (function(car) {
        return function() {
          car._engine.onLoop = null;
          car._engine.loop = false;
          car._engine.animationSpeed = 0.2;
          car._engine.textures = car._animations['engine-firedown'];
          car._engine.onComplete = ()  => {
            car._engine.stop();
            car._engine.visible = false;
          };
          car._engine.gotoAndPlay(0);
        }
      })(this);

      //wheels slowing
      this._decelerateTickerFunction = (function(car) {
        return () => {
          console.log(car._speed);
          car._speed = car._speed - 0.02;
          car._carBody.animationSpeed = car._speed;
          if(car._speed <= 0) {
            car._carBody.stop();
            car._ticker.remove(car._decelerateTickerFunction);
            car._ticker.remove(this);
            //make sure speed is 0
            car._ticker.stop();
            car._speed = 0;
          }
        }
      })(this);
      //stop calling accelerate and start decelerating
      this._ticker.remove(this._accelerateTickerFunction);
      this._ticker.add(this._decelerateTickerFunction);
      this._started = false;
    }
  }

  finish() {
    //TODO::Play finish animation
  }

  scaleToWidth(width) {
    let scaleFactor = width / this._originalWidth;
    this.container.scale.x = scaleFactor;
    this.container.scale.y = scaleFactor;
  }

  //private function for the starting acceleration animation
  static _accelerate(car) {  //turns the wheels faster and faster
    return function() {
      console.log(car._speed);
      if(car._speed < 2) {
        //turning the wheel
        car._speed += 0.02;
        car._carBody.animationSpeed = car._speed;
        if(!car._carBody.playing) car._carBody.gotoAndPlay(car._carBody.currentFrame);
        //firing the engine
        car._engine.animationSpeed = (car._speed < 0.6)? car._speed - 0.1 : 0.5
      }
    }
  }
  //return container for rendering
  get sprite() {
    return this.container;
  }

  get width() {
    return this.container.width;
  }

  set width(w) {
    this.container.width = w;
  }

  get x() {
    return this.container.x;
  }

  set x(x) {
      this.container.x = x
  }

  get y() {
    return this.container.y;
  }

  set y(y) {
    this.container.y = y;
  }

}
