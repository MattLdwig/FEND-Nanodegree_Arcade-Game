// Fonction debug
var gg = function() {
  console.log('X : ' + player.x + ' Y : ' + player.y);
  console.log("previousX " + previousX + "previousY " + previousY);
}
var level = 1;
var previousX = [];
var previousY = [];

/* Initialisation des ennemie */

var Enemy = function(x, y, moveRight) {
  this.moveRight = moveRight;
  this.endCanvas = 930;
  this.startCanvas = 0;
  this.x = x;
  this.y = y;
  this.width = 71;
  this.height = 50;
    switch (level) {
      case 1:
        this.speed =  200;
        break;
      case 2:
        this.speed =  400;
        break;
    }
  this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype.update = function(dt) {
  if (this.moveRight) {
    this.x += this.speed * dt;
    this.sprite = 'images/enemy-bug.png';
    if (this.x > this.endCanvas) {
      this.moveRight = false;
    }
  } else {
    this.sprite = 'images/enemy-bug-left.png';
    this.x -= this.speed * dt;
    if (this.x < this.startCanvas) {
      this.moveRight = true;
    }
  }
};

var allEnemies = [];

var resetBugs = function (level) {
  allEnemies = [];
  switch (level) {
    case 1:
      allEnemies.push(new Enemy(0, 53, true));
      allEnemies.push(new Enemy(0, 136, true));
      allEnemies.push(new Enemy(404, 500, true));
      break;
    case 2:
    allEnemies.push(new Enemy(0, 53, true));
    allEnemies.push(new Enemy(0, 136, true));
    allEnemies.push(new Enemy(0, 468, true));
      break;
  }
};

Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// PLAYER
var Player = function() {
  this.reset(808, 634);
  this.sprite = 'images/char-boy.png';
};

Player.prototype.changePosition = function() {
  previousX = this.x;
  previousY = this.y;
}

Player.prototype.reset = function(x, y) {
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
  if (this.col < 0) this.col = 0;
  if (this.col > 9) this.col = 9;
  if (this.row < 0) this.row = 0;
  if (this.row > 8) this.row = 8;
}

Player.prototype.update = function(dt) {

  if (this.movable && !(checkIfCollide())) {
    this.x = 101 * this.col;
    this.y = (83 * this.row) - 30;
  }
  if (this.y < 83 && this.movable && this.x === 101) {
    this.movable = false;
    hightScore.push(player.gem);
    player.reset();
    player.score += 10;
    level++;
    itemsByLevel(level);
    resetBugs(level);
    return true;
  }
  checkIfCollide();
  return false;
}

Player.prototype.block = function() {
  this.x = previousX;
  this.y = previousY;
}

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  ctx.font = "30px Source Sans";
  ctx.fillText('Hight Score :' + Math.max(...hightScore).toString(), 0, 30);
  ctx.fillText('Gem :' + player.gem, 250, 30);
}

// ToDO Mettre l'ensemble des objets dans une seule et même fonction

// GEMS
var Gem = function(x, y) {
  this.sprite = 'images/gem-blue.png';
  this.x = x;
  this.y = y;
  this.width = 101 / 2;
  this.height = 171 / 2;
}

Gem.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
}

var allGems = [];

allGems.push(new Gem(500, 200));
allGems.push(new Gem(606, 634));
// Rock

var Rock = function(x, y) {
  this.sprite = 'images/Rock.png';
  this.x = x;
  this.y = y;
  this.width = 86;
  this.height = 56;
}

Rock.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

var allRocks = [];

function itemsByLevel(level) {
  switch (level) {
    case 1:
      allRocks.push(new Rock(707, 551));
      allRocks.push(new Rock(303, 385));
      break;
    case 2:
      allRocks.push(new Rock(808, 219));
      allRocks.push(new Rock(101, 136));
    default:

  }
}

// Score

var hightScore = [0];

var player = new Player(808, 634);


var checkIfCollide = function() {

  var hitBox = function(width, height, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
  }

  checkCollision = function(avatar, items) {
    if ((avatar.x < items.x + items.width &&
        avatar.x + player.width > items.x &&
        avatar.y < items.y + items.height &&
        avatar.height + avatar.y > items.y)) {
      return true;
    }
  }

  var playerHitbox = new hitBox(player.width, player.height, player.x, player.y);

  for (var i = 0; i < allEnemies.length; i++) {
    var EnnemiesHitBox = new hitBox(allEnemies[i].width, allEnemies[i].height, allEnemies[i].x, allEnemies[i].y);
    if (checkCollision(playerHitbox, EnnemiesHitBox)) {
      player.reset();
    }
  }
  for (var i = 0; i < allRocks.length; i++) {
    var rocksHitBox = new hitBox(allRocks[i].width, allRocks[i].height, allRocks[i].x, allRocks[i].y);
    if (checkCollision(playerHitbox, rocksHitBox)) {
      player.block();
    }
  }
  for (var i = 0; i < allGems.length; i++) {
    var gemsHitBox = new hitBox(allGems[i].width, allGems[i].height, allGems[i].x, allGems[i].y);
    if (checkCollision(playerHitbox, gemsHitBox)) {
      player.gem += 1;
      allGems.splice(i, 1);
      break;
    }
  }

}
itemsByLevel(level);
resetBugs(level);

// DISPLAY
function randomize(max, min) {
  return Math.floor(Math.random() * (max, min));
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
