// logic for the Count game

class Game{
  constructor() {
    console.log(`Welcome to the game. Version ${this.version()}`);

    this.canvas = document.getElementById("game-canvas");
    this.stage = new createjs.Stage(this.canvas);

    createjs.Ticker.setFPS(60);

    // keep re-drawing the stage.
    createjs.Ticker.on("tick", this.stage);

    // testing code
    var circle = new createjs.Shape();
    circle.graphics.beginFill("gold").drawCircle(0,0,40);
    circle.x = circle.y = 100;
    this.stage.addChild(circle);
  }
  version(){
    return '1.0.0';
  }
}

// start the game
var game = new Game();
