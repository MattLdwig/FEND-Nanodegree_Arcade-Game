"use strict";

/* -------------------- Global -------------------- */
/** Global variables definitions. */

var playerWin = false,
    gemCollected = 0,
    level = 1,
    numOfTry = 0,
    previousX = [],
    previousY = [],
    tileWidth = 101,
    tileHeight = 171;

/** General render Method */

function CharacterRender(){
  this.render = function(){
    if(this.spriteWidth === undefined || this.spriteHeight === undefined){
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    } else {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.spriteWidth,this.spriteHeight);
    }
  }
}

/* -------------------- ENEMIES -------------------- */

/**
* @class Create the enemy class
* @description Create the enemies, initilizing the position and setup the speed
* @param {number} x position
* @param {number} y position
 *@param {boolean} if true the enemy move from left to right, else from right to left
*/

var Enemy = function(x, y, moveRight) {
  this.moveRight = moveRight;
  this.endCanvas = 930;
  this.startCanvas = 0;
  this.x = x;
  this.y = y;
  /** previousX used to bring the enemy back a frame and avoid collision loops */
  this.previousX = x;
  this.width = 71;
  this.height = 50;
  this.inheritFrom = CharacterRender;
  this.inheritFrom();
  /** Setup speed depending on the level */
  switch (level) {
    case 1:
      this.speed = 220;
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

/**
* @function Updating enemy function
* @description Update the enemy's position and display the proper sprite.
* If the player is in the first level, let the enemy cross the rocks and
* the screen. Otherwise, check if it collide.
* @param {number} dt delta time
*/

Enemy.prototype.update = function(dt) {
  this.previousX = this.x;
  if (this.moveRight) {
    this.x += this.speed * dt;
    this.sprite = 'images/enemy-bug.png';
      /* if the player is in the first level, the bugs cross the screen
         and doesn't collide with the rocks. Otherwise they remain within the
         limits of the canvas and collide with the rocks */
       if(level === 1){
         if (this.x > this.endCanvas+100){
               this.x = Math.floor((Math.random() * 100)-100);
          }
       }
       else {
         if (this.x > this.endCanvas || checkIfCollide()) {
           this.moveRight = false;
         }
       }
  } else {
    this.sprite = 'images/enemy-bug-left.png';
    this.x -= this.speed * dt;
      if (this.x < this.startCanvas || checkIfCollide()) {
        this.moveRight = true;
      }
  }
};

/** Array where the enemies are stored */
var allEnemies = [];

/**
* @function reset enemies function
* @description Empty the allEnemies array and push the new enemies according to
* the level
* @param {number} level
*/

var resetBugs = function(level) {
  allEnemies = [];
  switch (level) {
    case 1:
      allEnemies.push(new Enemy(-80, -30, true));
      allEnemies.push(new Enemy(-10, 219, true));
      allEnemies.push(new Enemy(-30, 385, true));
      allEnemies.push(new Enemy(-150, 385, true));
      allEnemies.push(new Enemy(-70, 551, true));
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

/* -------------------- PLAYER -------------------- */

/**
* @class Create the player class
* @description Create the player and initilizing his position
*/

var Player = function() {
  this.reset(808, 634);
  this.sprite = 'images/char-boy.png';
  this.inheritFrom = CharacterRender;
  this.inheritFrom();
};

/**
* @function
* @description Store the position of the player before moving.
* Used for block the player when he hit a rock
*/

Player.prototype.changePosition = function() {
  previousX = this.row;
  previousY = this.col;
};

/**
* @function Reset player function
* @description Reset the player to his initial position
* @param {number} x position
* @param {number} y position
*/

Player.prototype.reset = function(x, y) {
  this.width = tileWidth;
  this.height = tileHeight;
  this.col = 8;
  this.row = 8;
  this.movable = true;
  this.x = x;
  this.y = y;
};

/**
* @function Handle input player function
* @description Receive the user input.
* @param {string} key pressed by the user
*/

Player.prototype.handleInput = function(key) {
  /** Before moving, store the position in variables */
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
    this.reset(808,634);
      level = 1;
      resetBugs(1);
      itemsByLevel(1);
      break;
    default:
    console.log('Key not attribued');
  }
  /** Blocks the player if he reaches the limits of the canvas */
  if (this.col < 0) this.col = 0;
  if (this.col > 9) this.col = 9;
  if (this.row < 0) this.row = 0;
  if (this.row > 8) this.row = 8;
};

/**
* @function Updating player function
* @description Update the player's position. If the player reach the exit tile,
* reset his position, increase the level and call the itemsByLevel and resetBugs
* methods for display the appropriate items.
* If the player reach the exit in level 3, he win the game.
* @param {number} dt delta time
*/

Player.prototype.update = function(dt) {
  this.x = tileWidth * this.col;
  /** Move the sprite 30px to the top for better sprite centering */
  this.y = (83 * this.row) - 30;
  if (this.y === -30 && this.movable && this.x === 101) {
    this.movable = false;
    this.reset(808, 634);
    if (level === 3) {
      return playerWin = true;
    }
    level++;
    itemsByLevel(level);
    resetBugs(level);
    return true;
  }
  /** Check if the player collide */
  checkIfCollide();
  return false;
};

/**
* @function Block player method
* @description Bring the player back to his previous position.
*/
Player.prototype.block = function() {
  this.row = previousX;
  this.col = previousY;
};

/** Initialise the player */
var player = new Player(808, 634);


/* -------------------- GEMS AND ROCKS -------------------- */

/**
* @class Create the gem class
* @class Create the rock class
* @description Create the gem and the rock. Initilizing their positions.
* For Gem, spriteWidth & spriteHeight used for better rendering.
* @param {number} x position
* @param {number} y position
*/
var Gem = function(x, y) {
  this.sprite = 'images/gem-blue.png';
  this.x = x + 30;
  this.y = y + 50;
  this.width = tileWidth;
  this.height = tileHeight;
  this.spriteWidth = this.width / 2;
  this.spriteHeight = this.height / 2;
  this.inheritFrom = CharacterRender;
  this.inheritFrom();
};

var Rock = function(x, y) {
  this.sprite = 'images/Rock.png';
  this.x = x;
  this.y = y;
  this.width = tileWidth;
  this.height = tileHeight;
  this.inheritFrom = CharacterRender;
  this.inheritFrom();
};

/** Array where the rocks are stored */
var allRocks = [];

/** Array where the gems are stored */
var allGems = [];

/**
* @function Gems and Rocks initilization method
* @description Empty the rocks and gems array then push the appropriate items
* according to the level.
* @param {number} level
*/
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

/* -------------------- COLLISION -------------------- */

/** Method to check if the player or a bug collides width something */

var checkIfCollide = function() {

  /** Draw the general hitbox */
  var hitBox = function(left, top) {
    this.left = left + 35;
    this.top = top + 20;
    this.right = this.left + 65;
    this.bottom = this.top + 62;
  };

  /** 2D Collision method, from MDN */
  var checkCollision = function(avatar, items) {
    return !(avatar.left > items.right ||
      avatar.right < items.left ||
      avatar.top > items.bottom ||
      avatar.bottom < items.top);
  };

  /** Declaration of the player hitbox */
  var playerHitbox = new hitBox(player.x, player.y);

  /** if the player hit a rock, call the player.block method */
  for (var i = 0; i < allRocks.length; i++) {
    var rocksHitBox = new hitBox(allRocks[i].x, allRocks[i].y);
    if (checkCollision(playerHitbox, rocksHitBox)) {
      player.block();
    }

    /** if a bug hit a rock, reverse direction and bring it back one frame for
       avoid the collision loop */
    for (var j = 0; j < allEnemies.length; j++) {
      var EnemiesHitBox = new hitBox(allEnemies[j].x-30, allEnemies[j].y-20);
      if (checkCollision(EnemiesHitBox, rocksHitBox) && level > 1) {
        allEnemies[j].moveRight = !allEnemies[j].moveRight;
        allEnemies[j].x = allEnemies[j].previousX;
      }
      /* if the player hit a bug, reset the player and increase the number of tries */
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

/* -------------------- KEYBOARD INPUT -------------------- */

/**
* @description listen the key presses by the user and sends the keys to the player.handleInput() method
*/

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
