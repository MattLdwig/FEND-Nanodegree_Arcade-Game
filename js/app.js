
// Fonction debug
var gg = function() {
  console.log('X : ' + player.x + ' Y : ' +player.y);
}
var previousX = [];
var previousY = [];

// ENEMY
var Enemy = function(moveRight) {
    this.reset();
    this.moveRight = false;
    this.endCanvas = 930;
    this.startCanvas = 0;
};

Enemy.prototype.update = function(dt) {
    if(this.moveRight){
      this.x += this.speed * dt;
      this.sprite = 'images/enemy-bug.png';
        if(this.x > this.endCanvas){
          this.moveRight = false;
        }
    }
    else {
      this.sprite = 'images/enemy-bug-left.png';
      this.x -= this.speed * dt;
      if(this.x < this.startCanvas){
        this.moveRight = true;
      }
    }
};

Enemy.prototype.reset = function() {
  this.width = 98;
  this.height = 68;
  this.col = -1;
  this.row = randomize(1,7);
  this.x = 101 * this.col;
  this.y = 83 * this.row;
  this.speed = randomize(150,0);
};

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// BOARD
var board = function(){}
board.reset = function() {
  player.reset(808,634);
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
  this.reset(808,634);
  this.sprite = 'images/char-boy.png';
};

Player.prototype.changePosition = function() {
  previousX = this.x;
  previousY = this.y;
}

Player.prototype.reset = function(x,y){
  this.width = 68;
  this.height = 76;
  this.col = 8;
  this.row = 8;
  this.movable = true;
  this.score = 0;
  this.gem = 0;
  this.x = x;
  this.y = y;
}


Player.prototype.handleInput = function(key) {
  this.changePosition();
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
    if(this.row > 8) this.row = 8;
}

Player.prototype.block = function() {
  this.x = previousX;
  this.y = previousY;
}

Player.prototype.update = function(dt) {
  checkIfCollide();
  if(this.movable){
    this.x = 101 * this.col;
    this.y = (83 * this.row) -30;
  }
  if(this.y < 83 && this.movable && this.x === 101) {
    this.movable = false;
    hightScore.push(player.gem);
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
  ctx.fillText('Hight Score :' + Math.max(...hightScore).toString(),0,30);
  ctx.fillText('Gem :' + player.gem,250,30);
}


// ToDO Mettre l'ensemble des objets dans une seule et même fonction

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
     player.gem += 1;
     this.reset();
    }
}

// Rock

var Rock = function(x,y) {
  this.sprite = 'images/Rock.png';
  this.x = x;
  this.y = y;
  this.width = 86;
  this.heigth = 86;
}

Rock.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

var allRocks = [];

allRocks.push(new Rock(707,551));
allRocks.push(new Rock(303,385));


// Score

var hightScore = [0];

var player = new Player(808,634);

var allEnemies = [];

var enemie0 = new Enemy();
var enemie1 = new Enemy();
var enemie2 = new Enemy();
var enemie3 = new Enemy();
var enemie4 = new Enemy();
for(i=0; i < 6 ; i++){
  allEnemies.push(new Enemy());
}



var checkIfCollide = function(){

  var hitBox = function(width,height,x,y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
  }

  checkCollision = function(avatar,items) {
    if((avatar.x < items.x + items.width &&
     avatar.x + player.width > items.x &&
     avatar.y < items.y + items.height &&
     avatar.height + avatar.y > items.y)) {
       return true;
     }
   }

  var playerHitbox = new hitBox(player.width, player.height, player.x, player.y);

  for(var i = 0 ; i < allEnemies.length ; i++){
    var EnnemiesHitBox = new hitBox(allEnemies[i].width,allEnemies[i].height,allEnemies[i].x,allEnemies[i].y);
    if(checkCollision(playerHitbox,EnnemiesHitBox)) {
      board.reset();
    }
  }
  for(var i = 0 ; i < allRocks.length ; i++) {
      var RocksHitBox = new hitBox(allRocks[i].width,allRocks[i].height,allRocks[i].x,allRocks[i].y);
      if(checkCollision(playerHitbox,RocksHitBox)){
        alert('block');
        player.block();
      }
  }

}


// DISPLAY
function randomize(min,max){
  return  Math.floor(Math.random() * (max - min)) + min;
}

var gem = new Gem();

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
