'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SceneManager = function () {
  function SceneManager() {
    _classCallCheck(this, SceneManager);

    this.menuScene = document.getElementById('menu');
    this.gameScene = document.getElementById('game-canvas');
    this.gameOverScene = document.getElementById('gameover');
    this.hud = document.getElementById('hud');

    this.scoreText = document.getElementById('score-text');
    this.startButton = document.getElementById('start-game-button');
    this.restartButton = document.getElementById('restart-game-button');
    this.exitButton = document.getElementById('exit-button');

    this.handlePlayerClick();
  }

  _createClass(SceneManager, [{
    key: 'startGame',
    value: function startGame() {
      this.menuScene.classList.remove('active');
      this.gameOverScene.classList.remove('active');
      this.showHud();
      this.setGameScore(0);
    }
  }, {
    key: 'showMenu',
    value: function showMenu() {
      this.gameOverScene.classList.remove('active');
      this.menuScene.classList.add('active');
    }
  }, {
    key: 'showHud',
    value: function showHud() {
      this.hud.classList.add('active');
    }
  }, {
    key: 'hideHud',
    value: function hideHud() {
      this.hud.classList.remove('active');
    }
  }, {
    key: 'setGameScore',
    value: function setGameScore(score) {
      this.scoreText.textContent = score;
    }
  }, {
    key: 'gameOver',
    value: function gameOver() {
      this.gameOverScene.classList.add('active');
      this.hideHud();
    }
  }, {
    key: 'handlePlayerClick',
    value: function handlePlayerClick() {
      var manager = this;
      this.startButton.onclick = function (e) {
        manager.startGame();
        game.restartGame();

        e.preventDefault();
        return false;
      };

      this.exitButton.onclick = function (e) {
        manager.showMenu();

        e.preventDefault();
        return false;
      };

      this.restartButton.onclick = function (e) {
        manager.startGame();
        game.restartGame();

        e.preventDefault();
        return false;
      };
    }
  }]);

  return SceneManager;
}();

var LevelData = function LevelData() {
  _classCallCheck(this, LevelData);

  this.levels = [{ gapX: 0, gapY: 30, widthDiff: 0, total: 5, coinChance: 0.4, enemyChance: 0.2 }, { gapX: 10, gapY: 30, widthDiff: 30, total: 10, coinChance: 0.6, enemyChance: 0.3 }, { gapX: 20, gapY: 30, widthDiff: 30, total: 10, coinChance: 0.6, enemyChance: 0.2 }, { gapX: 40, gapY: 40, widthDiff: 100, total: 50, coinChance: 0.8, enemyChance: 0 }, { gapX: 20, gapY: 30, widthDiff: 30, total: 100, coinChance: 0.6, enemyChance: 0.4 }];
};

var ScoreCalculator = function () {
  function ScoreCalculator() {
    _classCallCheck(this, ScoreCalculator);

    this.score = 0;
  }

  _createClass(ScoreCalculator, [{
    key: 'increaseScore',
    value: function increaseScore(level) {
      // Note: level starts at 0. Expotential incremental.
      this.score += (level + 1) * (level + 1);
    }
  }]);

  return ScoreCalculator;
}();

var GameObject = function (_createjs$Container) {
  _inherits(GameObject, _createjs$Container);

  function GameObject(graphic) {
    _classCallCheck(this, GameObject);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(GameObject).call(this));

    if (graphic !== undefined) {
      _this.graphic = graphic;
      _this.addChild(_this.graphic);

      var b = _this.graphic.nominalBounds;
      _this.setBounds(b.x, b.y, b.width, b.height);
    }
    return _this;
  }

  return GameObject;
}(createjs.Container);

var MovableGameObject = function (_GameObject) {
  _inherits(MovableGameObject, _GameObject);

  function MovableGameObject(graphic) {
    _classCallCheck(this, MovableGameObject);

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(MovableGameObject).call(this, graphic));

    _this2.isOnGround = false;

    _this2.velocity = {
      x: 0,
      y: 0
    };
    _this2.on("tick", _this2.tick);
    return _this2;
  }

  _createClass(MovableGameObject, [{
    key: 'tick',
    value: function tick() {
      this.y += this.velocity.y;
      this.x += this.velocity.x;
    }
  }]);

  return MovableGameObject;
}(GameObject);

var Coin = function (_GameObject2) {
  _inherits(Coin, _GameObject2);

  function Coin() {
    _classCallCheck(this, Coin);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Coin).call(this, new lib.CoinGraphic()));
  }

  return Coin;
}(GameObject);

var Enemy = function (_MovableGameObject) {
  _inherits(Enemy, _MovableGameObject);

  function Enemy() {
    _classCallCheck(this, Enemy);

    var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(Enemy).call(this, new lib.ObstacleGraphic()));

    _this4.directionX = -1;
    _this4.speed = 0.5;
    _this4.offsetX = 0;
    _this4.maxOffset = 10;

    _this4.on('tick', _this4.move);
    return _this4;
  }

  _createClass(Enemy, [{
    key: 'move',
    value: function move() {
      this.velocity.x = this.speed * this.directionX;
      this.offsetX += this.velocity.x;
      if (Math.abs(this.offsetX) > this.maxOffset) {
        this.directionX *= -1;
      }
    }
  }]);

  return Enemy;
}(MovableGameObject);

var Hero = function (_MovableGameObject2) {
  _inherits(Hero, _MovableGameObject2);

  function Hero() {
    _classCallCheck(this, Hero);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Hero).call(this, new lib.HeroGraphic()));
  }

  _createClass(Hero, [{
    key: 'run',
    value: function run() {
      if (!this.isOnGround) {
        this.velocity.x = 2;
        this.graphic.gotoAndPlay('run');
        this.isOnGround = true;
      }
    }
  }, {
    key: 'jump',
    value: function jump() {
      if (this.isOnGround) {
        this.velocity.y = -13;
        this.graphic.gotoAndPlay('jump');
        this.isOnGround = false;
      }
    }
  }]);

  return Hero;
}(MovableGameObject);

var Platform = function (_GameObject3) {
  _inherits(Platform, _GameObject3);

  function Platform() {
    _classCallCheck(this, Platform);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Platform).call(this, new lib.PlatformGraphic()));
  }

  _createClass(Platform, [{
    key: 'setClippingWidth',
    value: function setClippingWidth(width) {
      this.graphic.instance.mask = new createjs.Shape(new createjs.Graphics().beginFill("#000").drawRect(0, 0, width, this.getBounds().height));
      this.setBounds(this.x, this.y, width, this.getBounds().height);
    }
  }]);

  return Platform;
}(GameObject);

var World = function (_createjs$Container2) {
  _inherits(World, _createjs$Container2);

  function World() {
    _classCallCheck(this, World);

    var _this7 = _possibleConstructorReturn(this, Object.getPrototypeOf(World).call(this));

    _this7.levelData = new LevelData();
    _this7.scoreCalculator = new ScoreCalculator();
    _this7.currentLevel = 0;

    _this7.on("tick", _this7.tick);

    // store all platforms
    _this7.platforms = [];

    _this7.enemies = [];
    _this7.coins = [];

    _this7.generatePlatforms();
    _this7.generateEnemies();
    _this7.generateCoins();
    _this7.addHero();
    _this7.hero.run();

    return _this7;
  }

  _createClass(World, [{
    key: 'tick',
    value: function tick() {
      this.applyGravity();

      var hitEnemy = this.targetHitTestObjects(this.hero, this.enemies);
      if (hitEnemy !== false) {
        console.log('hit!', hitEnemy);
        game.gameOver();
      }

      var hitCoin = this.targetHitTestObjects(this.hero, this.coins);
      if (hitCoin !== false) {
        this.eatCoin(hitCoin);
        this.scoreCalculator.increaseScore(this.currentLevel);
        console.log(this.scoreCalculator.score);
        sceneManager.setGameScore(this.scoreCalculator.score);
      }

      // is hero falling outside of screen?
      if (this.hero.y > game.stage.height) {
        game.gameOver();
      }

      // Focus on the Hero.
      this.x -= this.hero.velocity.x;
    }
  }, {
    key: 'addHero',
    value: function addHero() {
      var hero = new Hero();
      this.addChild(hero);
      hero.x = 100;
      hero.y = 100;
      this.hero = hero;
    }
  }, {
    key: 'generatePlatforms',
    value: function generatePlatforms() {
      var nextX = 100;
      var nextY = 200;

      var levelNumber = 0;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.levelData.levels[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var level = _step.value;

          for (var i = 0; i < level.total; i++) {
            var platform = new Platform();
            platform.x = nextX;
            platform.y = nextY;

            var width = platform.getBounds().width;
            platform.setClippingWidth(width - Math.random() * level.widthDiff);

            platform.levelNumber = levelNumber;

            this.platforms.push(platform);

            nextX = platform.x + platform.getBounds().width + Math.random() * level.gapX;
            nextY = platform.y + (Math.random() - 0.5) * level.gapY;

            this.addChild(platform);
          }
          levelNumber += 1;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: 'generateEnemies',
    value: function generateEnemies() {
      // skip first 2 platforms.
      for (var i = 2; i < this.platforms.length; i++) {
        var platform = this.platforms[i];
        var levelNumber = platform.levelNumber;
        var chance = this.levelData.levels[levelNumber].enemyChance;
        // net every platform needs enemy.
        if (Math.random() < chance) {
          var enemy = new Enemy();
          enemy.x = platform.x + platform.getBounds().width / 2;
          enemy.y = platform.y - enemy.getBounds().height;

          this.addChild(enemy);
          this.enemies.push(enemy);
        }
      }
    }
  }, {
    key: 'generateCoins',
    value: function generateCoins() {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.platforms[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var platform = _step2.value;


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
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: 'eatCoin',
    value: function eatCoin(coin) {
      for (var i = 0; i < this.coins.length; i++) {
        if (coin === this.coins[i]) {
          this.coins.splice(i, 1);
        }
      }
      coin.parent.removeChild(coin);
    }
  }, {
    key: 'applyGravity',
    value: function applyGravity() {
      var gravity = 1;
      var terminalVelocity = 5;
      // TODO: loop all movable game objects
      var object = this.hero;
      object.velocity.y += gravity;
      object.velocity.y = Math.min(object.velocity.y, terminalVelocity);

      if (this.willObjectOnGround(object)) {
        object.velocity.y = 1;
      }
      var platform = this.isObjectOnGround(object);
      if (platform !== false && object.velocity.y > 0) {
        this.currentLevel = platform.levelNumber;
        object.velocity.y = 0;
        object.run();
      }
    }
  }, {
    key: 'targetHitTestObjects',
    value: function targetHitTestObjects(target, objects) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = objects[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var object = _step3.value;

          if (this.objectsHitTest(target, object)) {
            return object;
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return false;
    }
  }, {
    key: 'objectsHitTest',
    value: function objectsHitTest(object1, object2) {
      var x1 = object1.x;
      var y1 = object1.y;
      var w1 = object1.getBounds().width;
      var h1 = object1.getBounds().height;

      var x2 = object2.x;
      var y2 = object2.y;
      var w2 = object2.getBounds().width;
      var h2 = object2.getBounds().height;

      return Math.abs(x1 - x2) * 2 < w1 + w2 && Math.abs(y1 - y2) * 2 < h1 + h2;
    }
  }, {
    key: 'isObjectOnGround',
    value: function isObjectOnGround(object) {
      var objectWidth = object.getBounds().width;
      var objectHeight = object.getBounds().height;

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = this.platforms[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var platform = _step4.value;

          var platformWidth = platform.getBounds().width;
          var platformHeight = platform.getBounds().height;

          if (object.x >= platform.x && object.x < platform.x + platformWidth && object.y + objectHeight >= platform.y && object.y + objectHeight <= platform.y + platformHeight) {
            return platform;
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      return false;
    }
  }, {
    key: 'willObjectOnGround',
    value: function willObjectOnGround(object) {
      var objectWidth = object.getBounds().width;
      var objectHeight = object.getBounds().height;
      var objectNextY = object.y + objectHeight + object.velocity.y;

      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = this.platforms[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var platform = _step5.value;

          var platformWidth = platform.getBounds().width;
          var platformHeight = platform.getBounds().height;

          if (object.x >= platform.x && object.x < platform.x + platformWidth && objectNextY >= platform.y && objectNextY <= platform.y + platformHeight) {
            return true;
          }
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      return false;
    }
  }]);

  return World;
}(createjs.Container);

var Game = function () {
  function Game() {
    _classCallCheck(this, Game);

    console.log('Welcome to the game. Version ' + this.version());

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

    this.gameLoaded = false;
    this.loadGraphics();
  }

  _createClass(Game, [{
    key: 'version',
    value: function version() {
      return '1.0.0';
    }
  }, {
    key: 'loadSound',
    value: function loadSound() {}
  }, {
    key: 'loadGraphics',
    value: function loadGraphics() {
      var loader = new createjs.LoadQueue(false);
      loader.addEventListener("fileload", handleFileLoad);
      loader.addEventListener("complete", handleComplete.bind(this));
      loader.loadFile({ src: "images/rush_game_graphics_atlas_.json", type: "spritesheet", id: "rush_game_graphics_atlas_" }, true);
      loader.loadManifest(lib.properties.manifest);

      function handleFileLoad(evt) {
        if (evt.item.type == "image") {
          images[evt.item.id] = evt.result;
        }
      }

      function handleComplete(evt) {
        var queue = evt.target;
        ss["rush_game_graphics_atlas_"] = queue.getResult("rush_game_graphics_atlas_");

        this.gameLoaded = true;
      }
    }
  }, {
    key: 'restartGame',
    value: function restartGame() {
      this.stage.removeAllChildren();

      // background
      this.stage.addChild(new lib.BackgroundGraphic());

      this.world = new World();
      this.stage.addChild(this.world);

      var hero = this.world.hero;
      this.stage.on('stagemousedown', function () {
        hero.jump();
      });
    }
  }, {
    key: 'gameOver',
    value: function gameOver() {
      sceneManager.gameOver();
    }
  }, {
    key: 'retinalize',
    value: function retinalize() {
      this.stage.width = this.canvas.width;
      this.stage.height = this.canvas.height;

      var ratio = window.devicePixelRatio;
      if (ratio === undefined) {
        return;
      }

      this.canvas.setAttribute('width', Math.round(this.stage.width * ratio));
      this.canvas.setAttribute('height', Math.round(this.stage.height * ratio));

      this.stage.scaleX = this.stage.scaleY = ratio;

      // Set CSS style
      this.canvas.style.width = this.stage.width + "px";
      this.canvas.style.height = this.stage.height + "px";
    }
  }]);

  return Game;
}();

// start the game


var game = new Game();

var sceneManager = new SceneManager();
