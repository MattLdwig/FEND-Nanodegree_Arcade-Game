// Enemies our player must avoid
var Enemy = function() {
    this.reset();
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.speed + this.x;

    if(this.x > 500) {
      this.reset();
    }
};

Enemy.prototype.reset = function() {
  this.col = -1;
  this.row = randomize(1,3);
  this.x = 101 * this.col;
  this.y = 83 * this.row;
  this.speed = randomize(1,5);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(){
  this.reset();
  this.sprite = 'images/char-boy.png';
};

Player.prototype.reset = function(){
  this.col = 4;
  this.row = 5;
  this.movable = true;
}

Player.prototype.handleInput = function(key) {
    switch (key) {
      case 'left':
        this.col--;
        break;
      case 'right':
        this.col++;
      break;
      case 'down':
        this.row++;
      break;
      case 'up':
        this.row--;
      break;
    }
    if(this.col < 0) this.col = 0;
    if(this.col > 4) this.col = 4;
    if(this.row < 0) this.row = 0;
    if(this.row > 5) this.row = 5;
}

Player.prototype.update = function(dt) {
  if(this.movable){
    this.x = 101 * this.col;
    this.y = 83 * this.row;
  }
  if(this.y < 83 && this.movable) {
    this.movable = false;
    player.reset();
    return true;
  }
    return false;
}

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

function randomize(min,max){
  return  Math.floor(Math.random() * (max - min)) + min;
}

function checkCollisions(){
  for(var i = 0 ; i < allEnemies.length ; i++){
      if((player.x && player.y) === allEnemies[i].x && allEnemies[i].y){
        player.reset();
        allEnemies[i].reset();
      }
  }
}
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];

var enemie0 = new Enemy();
var enemie1 = new Enemy();
var enemie2 = new Enemy();
for(i=0; i < 3 ; i++){
  allEnemies.push(new Enemy());
}


var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
