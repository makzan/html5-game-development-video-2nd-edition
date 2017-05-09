class LevelData {
  constructor() {
    this.levels = [
      {gapX:0, gapY:30, widthDiff: 0, total: 5, coinChance: 0.4, enemyChance: 0.2},
      {gapX:10, gapY:30, widthDiff: 30, total: 10, coinChance: 0.6, enemyChance: 0.3},
      {gapX:20, gapY:30, widthDiff: 30, total: 10, coinChance: 0.6, enemyChance: 0.2},
      {gapX:40, gapY:40, widthDiff: 100, total: 50, coinChance: 0.8, enemyChance: 0},
      {gapX:20, gapY:30, widthDiff: 30, total: 100, coinChance: 0.6, enemyChance: 0.4},
    ];
  }
}


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
  setClippingWidth(width) {
    this.graphic.instance.mask = new createjs.Shape(new createjs.Graphics().beginFill("#000").drawRect(0,0,width,this.getBounds().height));
    this.setBounds(this.x, this.y, width, this.getBounds().height);
  }
}

class World extends createjs.Container {
  constructor() {
    super();

    this.levelData = new LevelData();

    this.on("tick", this.tick);

    // store all platforms
    this.platforms = [];

    this.enemies = [];
    this.coins = [];

    this.generatePlatforms();
    this.generateEnemies();
    this.generateCoins();
    this.addHero();
    this.hero.run();

  }
  tick() {
    this.applyGravity();

    var hitEnemy = this.targetHitTestObjects(this.hero, this.enemies);
    if (hitEnemy !== false) {
      console.log('hit!', hitEnemy);
    }

    var hitCoin = this.targetHitTestObjects(this.hero, this.coins);
    if (hitCoin !== false) {
      console.log('coin!', hitCoin);
      this.eatCoin(hitCoin);
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
    var nextX = 100;
    var nextY = 200;

    var levelNumber = 0;
    for (var level of this.levelData.levels) {
      for (var i=0; i<level.total; i++) {
        var platform = new Platform();
        platform.x = nextX;
        platform.y = nextY;

        var width = platform.getBounds().width;
        platform.setClippingWidth( width - Math.random() * level.widthDiff );

        platform.levelNumber = levelNumber;

        this.platforms.push(platform);

        nextX = platform.x + platform.getBounds().width + Math.random() * level.gapX;
        nextY = platform.y + (Math.random() - 0.5) * level.gapY;

        this.addChild(platform);
      }
      levelNumber += 1;
    }

  }
  generateEnemies() {
    // skip first 2 platforms.
    for (var i=2; i<this.platforms.length; i++) {
      var platform = this.platforms[i];
      var levelNumber = platform.levelNumber;
      var chance = this.levelData.levels[levelNumber].enemyChance;
      // net every platform needs enemy.
      if (Math.random() < chance) {
        var enemy = new Enemy();
        enemy.x = platform.x + platform.getBounds().width/2;
        enemy.y = platform.y - enemy.getBounds().height;

        this.addChild(enemy);
        this.enemies.push(enemy);
      }
    }
  }
  generateCoins() {
    for (var platform of this.platforms) {

      var levelNumber = platform.levelNumber;
      var chance = this.levelData.levels[levelNumber].coinChance;
      if (Math.random() < chance) {
        var coin = new Coin();
        coin.x = platform.x + Math.random() * platform.getBounds().width;
        coin.y = platform.y - coin.getBounds().height;
        this.addChild(coin);
        this.coins.push(coin);
      }
    }
  }
  eatCoin(coin) {
    for (var i=0; i<this.coins.length; i++) {
      if (coin === this.coins[i]) {
        this.coins.splice(i, 1);
      }
    }
    coin.parent.removeChild(coin);
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
