
// ENEMY
var Enemy = function() {
    this.reset();
    this.sprite = 'images/enemy-bug.png';
};
Enemy.prototype.update = function(dt) {
    this.x = this.speed * dt + this.x;
    if(this.x > 1000) {
      this.reset();
    }
    if (this.x > -20){
      this.checkCollisions();
    }
};
Enemy.prototype.reset = function() {
  this.width = 98;
  this.height = 68;
  this.col = -1;
  this.row = randomize(0,5);
  this.x = 101 * this.col;
  this.y = (83 * this.row)+50;
  this.speed = randomize(20,200);
};
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
Enemy.prototype.checkCollisions = function() {
  if(((player.x < this.x + this.width &&
   player.x + player.width > this.x &&
   player.y < this.y + this.height &&
   player.height + player.y > this.y))) {
     board.reset();
   }
}

// BOARD
var board = function(){}
board.reset = function() {
  player.reset(0);
  for(var i = 0 ; i < allEnemies.length ; i++) {
    allEnemies[i].reset();
  }
  gem.reset();
  if (player.score > 0) {
    player.score -= 10;
  }
}

// PLAYER
var Player = function(){
  this.reset();
  this.sprite = 'images/char-boy.png';
};
Player.prototype.reset = function(){
  this.width = 68;
  this.height = 76;
  this.col = 5;
  this.row = 6;
  this.movable = true;
  this.score = 0;
  this.gem = 0;
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
    if(this.col > 9) this.col = 9;
    if(this.row < 0) this.row = 0;
    if(this.row > 6) this.row = 6;
}
Player.prototype.update = function(dt) {
  if(this.movable){
    this.x = 101 * this.col;
    this.y = 83 * this.row;
  }
  if(this.y < 83 && this.movable) {
    this.movable = false;
    player.reset();
    player.score += 10;
    return true;
  }
    gem.checkCollisions();
    return false;
}
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  ctx.font="30px Source Sans";
  ctx.fillText('Score :' + player.score,0,30);
  ctx.fillText('Gem :' + player.gem,150,30);
}

// GEMS
var Gem = function() {
  this.reset();
  this.sprite = 'images/gem-blue.png';
  this.sprite.width = 101/2;
  this.sprite.height = 171/2;
}
Gem.prototype.reset = function() {
  this.width = 95/2;
  this.height = 105/2;
  this.col = randomize(0,9);
  this.row = randomize(1,5);
  this.x = (101 * this.col)+25;
  this.y = (83 * this.row)+25;
  this.spriteWidth = 101/2;
  this.spriteHeight = 171/2;
}
Gem.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.spriteWidth, this.spriteHeight);
}
Gem.prototype.checkCollisions = function() {
  if(((player.x < this.x + this.width &&
   player.x + player.width > this.x &&
   player.y < this.y + this.height &&
   player.height + player.y > this.y))) {
     this.reset();
     player.gem += 1;
    }
}

// Heart
var Heart = function() {
  this.sprite = 'images/Heart.png';
  this.x = 909;
  this.y = 0;
  this.Spritewidth = 101/3;
  this.Spriteheight = 171/3;
}
Heart.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.Spritewidth, this.Spriteheight );
};


// DISPLAY
function randomize(min,max){
  return  Math.floor(Math.random() * (max - min)) + min;
}


var gem = new Gem();
var player = new Player();
var heart = new Heart();
var allEnemies = [];

var enemie0 = new Enemy();
var enemie1 = new Enemy();
var enemie2 = new Enemy();
var enemie3 = new Enemy();
var enemie4 = new Enemy();
for(i=0; i < 6 ; i++){
  allEnemies.push(new Enemy());
}

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
