"use strict";

// Global Variables definitions
var playerWin = false;
var gemCollected = 0;
var level = 1;
var numOfTry = 0;
var previousX = [];
var previousY = [];

// ENEMY DECLARATION

var Enemy = function(x, y, moveRight) {
  this.moveRight = moveRight;
  this.endCanvas = 930;
  this.startCanvas = 0;
  this.x = x;
  this.y = y;
  // previousX used to bring the enemy back a frame and avoid collision loops
  this.previousX = x;
  this.width = 71;
  this.height = 50;
  // Setup speed depending on the level
  switch (level) {
    case 1:
      this.speed = 200;
      break;
    case 2:
      this.speed = 250;
      break;
    case 3:
      this.speed = 300;
      break;
    default:
      this.speed = 200;
  }
  this.sprite = 'images/enemy-bug.png';
};

// Updating function, call in each frame
// todo Refactor the function
Enemy.prototype.update = function(dt) {
  this.previousX = this.x;
  // if the bug move from left to right, display the proper sprite
  if (this.moveRight) {
    this.x += this.speed * dt;
    this.sprite = 'images/enemy-bug.png';
    /* if the bug hit the end of the canvas or hit a rock, bug move to right to left
       and display the proper sprite */
    if (this.x > this.endCanvas || checkIfCollide()) {
      this.moveRight = false;
    }
    // else if the bug move from right to left, display the proper sprite
  } else {
    this.sprite = 'images/enemy-bug-left.png';
    this.x -= this.speed * dt;
    /* if the bug hit the begin of the canvas or hit a rock, bug move to left to right
       and display the proper sprite */
    if (this.x < this.startCanvas || checkIfCollide()) {
      this.moveRight = true;
    }
  }
};

var allEnemies = [];

// Empty allEnemies and push the bugs in the array depending on the level
var resetBugs = function(level) {
  allEnemies = [];
  switch (level) {
    case 1:
      allEnemies.push(new Enemy(202, -30, true));
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
      allEnemies.push(new Enemy(303, -30, true));
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
      allEnemies.push(new Enemy(303, -30, true));
      allEnemies.push(new Enemy(0, 53, true));
      break;
      default:
        alert("Oops, this level doesn't exist");
  }
};

// Render function
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// PLAYER DECLARATION
var Player = function() {
  this.reset(808, 634);
  this.sprite = 'images/char-boy.png';
};

/* On each input, stock the position of the player before moving,
   Used for block the player when he hit a rock */
// ToDo Régler le problème d'animation.
Player.prototype.changePosition = function() {
  previousX = this.row;
  previousY = this.col;
};

// Reset function
Player.prototype.reset = function(x, y) {
  this.width = 101;
  this.height = 171;
  this.col = 8;
  this.row = 8;
  this.movable = true;
  this.x = x;
  this.y = y;
};

// Player Input Function
Player.prototype.handleInput = function(key) {
  // Before moving, stock the position in variables
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
    case 'esc':
    player.reset(808,634);
      level = 1;
      resetBugs(1);
      itemsByLevel(1);
      break;
    default:
    console.log('Key not attribued');
  }
  // Blocks the player if he reaches the limits of the canvas
  if (this.col < 0) this.col = 0;
  if (this.col > 9) this.col = 9;
  if (this.row < 0) this.row = 0;
  if (this.row > 8) this.row = 8;
};

// Update function
Player.prototype.update = function(dt) {
  this.x = 101 * this.col;
  // Move the sprite 30px to the top for better sprite centering
  this.y = (83 * this.row) - 30;
  // if the player reach the exit coords, reset the player position
  if (this.y === -30 && this.movable && this.x === 101) {
    this.movable = false;
    player.reset(808, 634);
    // if the player reach the exit coords in level 3, he win the game
    if (level === 3) {
      return playerWin = true;
    }
    // Incrase the level ; Reset the bugs and the items
    level++;
    itemsByLevel(level);
    resetBugs(level);
    return true;
  }
  // Check if the player collide
  checkIfCollide();
  return false;
};

// if the player hit a rock, block him
Player.prototype.block = function() {
  this.row = previousX;
  this.col = previousY;
};

// Player Render Function
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Initialise the player
var player = new Player(808, 634);

// GEMS DECLARATION
var Gem = function(x, y) {
  this.sprite = 'images/gem-blue.png';
  this.x = x + 30;
  this.y = y + 50;
  this.width = 101;
  this.height = 171;
  // spriteWidth & spriteHeight used for better rendering
  this.spriteWidth = this.width / 2;
  this.spriteHeight = this.height / 2;
};

// Gem Render Function
Gem.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.spriteWidth, this.spriteHeight);
};

// Array used for stock the gems
var allGems = [];

// ROCKS DECLARATION

var Rock = function(x, y) {
  this.sprite = 'images/Rock.png';
  this.x = x;
  this.y = y;
  this.width = 101;
  this.height = 171;
};

// Rock Render Function
Rock.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Array used for stock the rocks
var allRocks = [];
/* Empty rocks and gems arrays and
   push all items in the arrays depending on the level*/
function itemsByLevel(level) {
  allRocks = [];
  allGems = [];
  switch (level) {
    case 1:
      allRocks.push(new Rock(101, 551));
      allRocks.push(new Rock(202, 136));
      allRocks.push(new Rock(606, -30));
      allRocks.push(new Rock(707, 551));
      allRocks.push(new Rock(303, 385));
      allRocks.push(new Rock(303, 634));
      allRocks.push(new Rock(707, 302));
      allGems.push(new Gem(0, 551));
      allGems.push(new Gem(505, 136));
      allGems.push(new Gem(202, 302));
      allGems.push(new Gem(101, 136));
      allGems.push(new Gem(404, -30));
      break;
    case 2:
      allRocks.push(new Rock(202, 634));
      allRocks.push(new Rock(101, 551));
      allRocks.push(new Rock(707, 551));
      allRocks.push(new Rock(808, 468));
      allRocks.push(new Rock(303, 385));
      allRocks.push(new Rock(202, 136));
      allRocks.push(new Rock(505, 302));
      allRocks.push(new Rock(707, 53));
      allRocks.push(new Rock(909, 53));
      allRocks.push(new Rock(202, -30));
      allGems.push(new Gem(505, 468));
      allGems.push(new Gem(202, 385));
      allGems.push(new Gem(0, 634));
      allGems.push(new Gem(707, -30));
      allGems.push(new Gem(0, 53));
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
      allGems.push(new Gem(202, 551));
      allGems.push(new Gem(303, 202));
      allGems.push(new Gem(606, 136));
      allGems.push(new Gem(303, -30));
      allGems.push(new Gem(808, 385));
      break;
    default:
      alert("Oops, this level doesn't exist");
  }
}

/* COLLISION FONCTION */
var checkIfCollide = function() {
  // Draw the general hitbox
  var hitBox = function(left, top) {
    this.left = left + 35;
    this.top = top + 20;
    this.right = this.left + 65;
    this.bottom = this.top + 62;
  };
  // 2D Collision Function, from MDN
  var checkCollision = function(avatar, items) {
    return !(avatar.left > items.right ||
      avatar.right < items.left ||
      avatar.top > items.bottom ||
      avatar.bottom < items.top);
  };
  // Declaration of the player hitbox
  var playerHitbox = new hitBox(player.x, player.y);
  // if the player hit a rock, call the player.block function
  for (var i = 0; i < allRocks.length; i++) {
    var rocksHitBox = new hitBox(allRocks[i].x, allRocks[i].y);
    if (checkCollision(playerHitbox, rocksHitBox)) {
      player.block();
    }
    /* if a bug hit a rock, reverse direction and bring it back one frame for
       avoid the collision loop */
    for (var j = 0; j < allEnemies.length; j++) {
      var EnemiesHitBox = new hitBox(allEnemies[j].x-30, allEnemies[j].y-20);
      if (checkCollision(EnemiesHitBox, rocksHitBox)) {
        allEnemies[j].moveRight = !allEnemies[j].moveRight;
        allEnemies[j].x = allEnemies[j].previousX;
      }
      else if (checkCollision(playerHitbox, EnemiesHitBox)) {
        player.reset(808, 634);
        numOfTry++;
        break;
      }
    }
  }
  /* if the player hit a gem, update gemCollected, remove the gem of the array
     and increase the speed of the bugs */
  for (i = 0; i < allGems.length; i++) {
    var gemsHitBox = new hitBox(allGems[i].x, (allGems[i].y - 50));
    if (checkCollision(playerHitbox, gemsHitBox)) {
      gemCollected += 1;
      allGems.splice(i, 1);
      for (i = 0; i < allEnemies.length; i++) {
        allEnemies[i].speed += 20;
      }
      break;
    }
  }
};

document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    27 : 'esc'
  };
  player.handleInput(allowedKeys[e.keyCode]);
});
