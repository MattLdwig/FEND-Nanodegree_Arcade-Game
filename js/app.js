var Enemy = function() {
    this.reset();
    this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype.update = function(dt) {
    this.x = this.speed * dt + this.x;
    if(this.x > 500) {
      this.reset();
    }
    if (this.x > -20){
      this.checkCollisions();
    }
};

var board = function(){}

board.reset = function() {
  player.reset();
  for(var i = 0 ; i < allEnemies.length ; i++) {
    allEnemies[i].reset();
  }
  player.score = 0;
}

Enemy.prototype.reset = function() {
  this.width = 98;
  this.height = 68;
  this.col = -1;
  this.row = randomize(1,4);
  this.x = 101 * this.col;
  this.y = 83 * this.row;
  this.speed = randomize(20,100);
};

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Player = function(){
  this.reset();
  this.sprite = 'images/char-boy.png';
};

Player.prototype.reset = function(){
  this.width = 68;
  this.height = 76;
  this.col = 4;
  this.row = 5;
  this.movable = true;
}

Enemy.prototype.checkCollisions = function() {
  if(((player.y + player.height) < (this.y)) ||
      (player.y > (this.y + this.height)) ||
      ((player.x + player.width) < this.x) ||
      (player.x > (this.x + this.width))) {
      }
      else {
        board.reset();
      }
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
    this.score += 1;
    player.reset();
    return true;
  }
    return false;
}

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.score = function() {
  this.score = 0;
}

function randomize(min,max){
  return  Math.floor(Math.random() * (max - min)) + min;
}


var allEnemies = [];

var enemie0 = new Enemy();
var enemie1 = new Enemy();
var enemie2 = new Enemy();
var enemie3 = new Enemy();
var enemie4 = new Enemy();
for(i=0; i < 6 ; i++){
  allEnemies.push(new Enemy());
}


var player = new Player();

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
