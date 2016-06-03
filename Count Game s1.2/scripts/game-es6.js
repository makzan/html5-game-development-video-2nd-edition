// logic for the Count game

class Game{
  constructor() {
    console.log(`Welcome to the game. Version ${this.version()}`);
  }
  version(){
    return '1.0.0';
  }
}

// start the game
var game = new Game();
