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

    this.isOnGround = false;

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

class Coin extends GameObject {
  constructor() {
    super(new lib.CoinGraphic());
  }
}

class Enemy extends MovableGameObject {
  constructor() {
    super(new lib.ObstacleGraphic());

    this.directionX = -1;
    this.speed = 0.5;
    this.offsetX = 0;
    this.maxOffset = 10;

    this.on('tick', this.move);
  }
  move() {
    this.velocity.x = this.speed * this.directionX;
    this.offsetX += this.velocity.x;
    if (Math.abs(this.offsetX) > this.maxOffset) {
      this.directionX *= -1;
    }
  }
}

class Hero extends MovableGameObject {
  constructor() {
    super( new lib.HeroGraphic() );
  }
  run() {
    if (!this.isOnGround) {
      this.velocity.x = 2;
      this.graphic.gotoAndPlay('run');
      this.isOnGround = true;
    }
  }
  jump() {
    if (this.isOnGround) {
      this.velocity.y = -13;
      this.graphic.gotoAndPlay('jump');
      this.isOnGround = false;
    }
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

    this.enemies = [];

    this.generatePlatforms();
    this.addHero();
    this.hero.run();

    // testing code
    var enemy = new Enemy();
    enemy.x = 300;
    enemy.y = 290;
    this.addChild(enemy);
    this.enemies.push(enemy);

    var coin = new Coin();
    coin.x = 360;
    coin.y = 290;
    this.addChild(coin);
  }
  tick() {
    this.applyGravity();

    var hitEnemy = this.targetHitTestObjects(this.hero, this.enemies);
    if (hitEnemy !== false) {
      console.log('hit!', hitEnemy);
    }

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
      object.run();
    }

  }
  targetHitTestObjects(target, objects) {
    for (var object of objects) {
      if (this.objectsHitTest(target, object)) {
        return object;
      }
    }
    return false;
  }
  objectsHitTest(object1, object2) {
    var x1 = object1.x;
    var y1 = object1.y;
    var w1 = object1.getBounds().width;
    var h1 = object1.getBounds().height;

    var x2 = object2.x;
    var y2 = object2.y;
    var w2 = object2.getBounds().width;
    var h2 = object2.getBounds().height;


    return (Math.abs(x1 - x2) * 2 < (w1 + w2)) &&
           (Math.abs(y1 - y2) * 2 < (h1 + h2));
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
    // background
    this.stage.addChild(new lib.BackgroundGraphic());

    this.world = new World();
    this.stage.addChild(this.world);

    var hero = this.world.hero;
    this.stage.on('stagemousedown', function(){
      hero.jump();
    });
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
