class GameObject extends createjs.Container {
  constructor(graphic) {
    super();

    if (graphic !== undefined) {
      this.graphic = graphic;
      this.addChild(this.graphic);

      var b = this.graphic.nominalBounds;
      this.setBounds(b.x, b.y, b.width, b.height);
    }
  }
}

class MovableGameObject extends GameObject {
  constructor(graphic) {
    super(graphic);

    this.velocity = {
      x: 0,
      y: 0
    }
    this.on("tick", this.tick);
  }
  tick() {
    this.y += this.velocity.y;
    this.x += this.velocity.x;
  }
}

class Hero extends MovableGameObject {
  constructor() {
    super( new lib.HeroGraphic() );
  }
  run() {
    this.velocity.x = 2;
    this.graphic.gotoAndPlay('run');
  }
}

class Platform extends GameObject {
  constructor() {
    super( new lib.PlatformGraphic() );
  }
}

class World extends createjs.Container {
  constructor() {
    super();

    this.on("tick", this.tick);

    // store all platforms
    this.platforms = [];

    this.generatePlatforms();
    this.addHero();
    this.hero.run();
  }
  tick() {
    this.applyGravity();

    // Focus on the Hero.
    this.x -= this.hero.velocity.x;
  }
  addHero() {
    var hero = new Hero();
    this.addChild(hero);
    hero.x = 100;
    hero.y = 100;
    this.hero = hero;
  }
  generatePlatforms() {
    var platform = new Platform();
    platform.x = 100;
    platform.y = 300;
    this.platforms.push(platform);
    this.addChild(platform);

    // 2nd platform
    platform = new Platform();
    platform.x = 250;
    platform.y = 300;
    this.platforms.push(platform);

    this.addChild(platform);
  }
  applyGravity() {
    var gravity = 1;
    var terminalVelocity = 5;
    // TODO: loop all movable game objects
    var object = this.hero;
    object.velocity.y += gravity;
    object.velocity.y = Math.min(object.velocity.y, terminalVelocity);

    if (this.willObjectOnGround(object)) {
      object.velocity.y = 1;
    }
    if (this.isObjectOnGround(object) && object.velocity.y > 0) {
      object.velocity.y = 0;
    }

  }
  isObjectOnGround(object) {
    var objectWidth = object.getBounds().width;
    var objectHeight = object.getBounds().height;

    for (var platform of this.platforms) {
      var platformWidth = platform.getBounds().width;
      var platformHeight = platform.getBounds().height;

      if (object.x >= platform.x &&
          object.x < platform.x + platformWidth &&
          object.y + objectHeight >= platform.y &&
          object.y + objectHeight <= platform.y + platformHeight
      ) {
        return true;
      }
    }
    return false;
  }
  willObjectOnGround(object) {
    var objectWidth = object.getBounds().width;
    var objectHeight = object.getBounds().height;
    var objectNextY = object.y + objectHeight + object.velocity.y;

    for (var platform of this.platforms) {
      var platformWidth = platform.getBounds().width;
      var platformHeight = platform.getBounds().height;

      if (object.x >= platform.x &&
          object.x < platform.x + platformWidth &&
          objectNextY >= platform.y &&
          objectNextY <= platform.y + platformHeight
      ) {
        return true;
      }
    }
    return false;
  }
}

class Game{
  constructor() {
    console.log(`Welcome to the game. Version ${this.version()}`);

    this.loadSound();

    this.canvas = document.getElementById("game-canvas");
    this.stage = new createjs.Stage(this.canvas);

    this.stage.width = this.canvas.width;
    this.stage.height = this.canvas.height;

    // enable tap on touch device
    createjs.Touch.enable(this.stage);

    // enable retina screen
    this.retinalize();

    createjs.Ticker.setFPS(60);

    // keep re-drawing the stage.
    createjs.Ticker.on("tick", this.stage);

    this.loadGraphics();
  }
  version(){
    return '1.0.0';
  }
  loadSound() {

  }
  loadGraphics() {
    var loader = new createjs.LoadQueue(false);
  	loader.addEventListener("fileload", handleFileLoad);
  	loader.addEventListener("complete", handleComplete.bind(this));
  	loader.loadFile({src:"images/rush_game_graphics_atlas_.json", type:"spritesheet", id:"rush_game_graphics_atlas_"}, true);
  	loader.loadManifest(lib.properties.manifest);

    function handleFileLoad(evt) {
    	if (evt.item.type == "image") { images[evt.item.id] = evt.result; }
    }

    function handleComplete(evt) {
    	var queue = evt.target;
    	ss["rush_game_graphics_atlas_"] = queue.getResult("rush_game_graphics_atlas_");

      this.restartGame();
    }
  }
  restartGame() {
    this.world = new World();
    this.stage.addChild(this.world);
  }

  retinalize() {
    this.stage.width = this.canvas.width;
    this.stage.height = this.canvas.height;

    let ratio = window.devicePixelRatio;
    if (ratio === undefined) {
      return;
    }

    this.canvas.setAttribute('width', Math.round( this.stage.width * ratio ));
    this.canvas.setAttribute('height', Math.round( this.stage.height * ratio ));

    this.stage.scaleX = this.stage.scaleY = ratio;

    // Set CSS style
    this.canvas.style.width = this.stage.width + "px";
    this.canvas.style.height = this.stage.height + "px";
  }
}

// start the game
var game = new Game();
