// Fonction debug
var gg = function() {
  console.log('X : ' + player.x + ' Y : ' + player.y);
  console.log("previousX " + previousX + "previousY " + previousY);
}
var playerWin = false;
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
        this.speed =  200;
        break;
      case 3:
        this.speed =  200;
        break;
    }
  this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype.update = function(dt) {
  if (this.moveRight) {
    this.x += this.speed *dt;
    this.sprite = 'images/enemy-bug.png';
    if (this.x > this.endCanvas || checkIfCollide()) {
      this.moveRight = false;
    }
  } else {
    this.sprite = 'images/enemy-bug-left.png';
    this.x -= this.speed * dt;
    if (this.x < this.startCanvas || checkIfCollide()) {
      this.moveRight = true;
    }
  }
  checkIfCollide();
};

var allEnemies = [];

var resetBugs = function (level) {
  allEnemies = [];
  switch (level) {
    case 1:
      allEnemies.push(new Enemy(202, 0, true));
      allEnemies.push(new Enemy(707, 219, true));
      allEnemies.push(new Enemy(0, 385, true));
      allEnemies.push(new Enemy(404, 385, true));
      allEnemies.push(new Enemy(202, 551, true));
      break;
    case 2:
      allEnemies.push(new Enemy(202, 551, true));
      allEnemies.push(new Enemy(0, 468, true));
      allEnemies.push(new Enemy(0, 385, true));
      allEnemies.push(new Enemy(404, 385, true));
      allEnemies.push(new Enemy(202, 302, true));
      allEnemies.push(new Enemy(707, 219, true));
      allEnemies.push(new Enemy(303, 0, true));
      allEnemies.push(new Enemy(0, 53, true));
      break;
      case 3:
          allEnemies.push(new Enemy(202, 551, true));
          allEnemies.push(new Enemy(0, 468, true));
          allEnemies.push(new Enemy(0, 385, true));
          allEnemies.push(new Enemy(404, 385, true));
          allEnemies.push(new Enemy(202, 302, true));
          allEnemies.push(new Enemy(707, 219, true));
          allEnemies.push(new Enemy(707, 136, true));
          allEnemies.push(new Enemy(303, 0, true));
          allEnemies.push(new Enemy(0, 53, true));
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
  this.width = 101;
  this.height = 171;
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

    this.x = 101 * this.col;
    this.y = (83 * this.row) - 30;

  if (this.y === 634 && this.movable && this.x === 707) {
    this.movable = false;
    hightScore.push(player.gem);
    player.reset();
    player.score += 10;
    if(level === 3) {
      playerWin = true;
    }
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
  this.x = x+30;
  this.y = y+50;
  this.width = 101;
  this.height = 171;
  this.spriteWidth = this.width/2;
  this.spriteHeight = this.height/2;
}

Gem.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite),this.x, this.y,this.spriteWidth,this.spriteHeight);
}

var allGems = [];

// Rock

var Rock = function(x, y) {
  this.sprite = 'images/Rock.png';
  this.x = x;
  this.y = y;
  this.width = 101;
  this.height = 171;
}

Rock.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

var allRocks = [];

function itemsByLevel(level) {
  allRocks = [];
  allGems = [];
  switch (level) {
    case 1:
      allRocks.push(new Rock(101, 551));
      allRocks.push(new Rock(707, 551));
      allRocks.push(new Rock(303, 385));
      allGems.push(new Gem(0, 551));
      allGems.push(new Gem(505, 136));
      allGems.push(new Gem(323, 362));
      break;
    case 2:
    allRocks.push(new Rock(202, 634));
    allRocks.push(new Rock(101, 551));
    allRocks.push(new Rock(707, 551));
    allRocks.push(new Rock(808, 468));
    allRocks.push(new Rock(303, 385));
    allRocks.push(new Rock(505, 302));
    allRocks.push(new Rock(707, 53));
    allRocks.push(new Rock(909, 53));
    allRocks.push(new Rock(202, -30));
    break;
    case 3:
    allRocks.push(new Rock(202, 634));
    allRocks.push(new Rock(101, 551));
    allRocks.push(new Rock(606, 551));
    allRocks.push(new Rock(808, 468));
    allRocks.push(new Rock(909, 385));
    allRocks.push(new Rock(303, 385));
    allRocks.push(new Rock(505, 302));
    allRocks.push(new Rock(707, 53));
    allRocks.push(new Rock(909, 53));
    allRocks.push(new Rock(202, -30));
    break;
  }
}

// Score

var hightScore = [0];

var player = new Player(808, 634);

var checkIfCollide = function() {

  var hitBox = function(left,top) {
    this.left = left + 35;
    this.top = top + 20;
    this.right = this.left + 65;
    this.bottom = this.top + 62;
  }

  checkCollision = function(avatar, items) {
    return !(avatar.left > items.right ||
            avatar.right < items.left ||
            avatar.top > items.bottom ||
            avatar.bottom < items.top)
  }

  var playerHitbox = new hitBox(player.x, player.y);
// TO DO
// Reorganiser la fonction pour ne pas doubler la création de hitbox
  for (var i = 0; i < allRocks.length; i++) {
    var rocksHitBox = new hitBox(allRocks[i].x, allRocks[i].y);
    if (checkCollision(playerHitbox, rocksHitBox)) {
      player.block();
    }
    for (var j = 0; j < allEnemies.length; j++) {
      var EnemiesHitBox = new hitBox(allEnemies[j].x, allEnemies[j].y);
        if(checkCollision(EnemiesHitBox,rocksHitBox)){
          allEnemies[j].moveRight = !allEnemies[j].moveRight;
      }
    }
  }

  for (var i = 0; i < allEnemies.length; i++) {
    var EnemiesHitBox = new hitBox(allEnemies[i].x, allEnemies[i].y);
    if (checkCollision(playerHitbox, EnemiesHitBox)) {
     //player.reset();
    }
  }
  for (var i = 0; i < allGems.length; i++) {
    var gemsHitBox = new hitBox(allGems[i].x, (allGems[i].y-50));
    if (checkCollision(playerHitbox, gemsHitBox)) {
      player.gem += 1;
      allGems.splice(i, 1);
      break;
    }
  }
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
