//window dimensions
wHeight = 500;
wWidth = 500;

//background scrolling positions
x1 = wWidth;
x2 = 0;
fr = 30;
obstalces = [];
function atLeft(x, y, width) {
  if(x-(width/2) <= 0) {
    return true
  }
  return false
}
//define animations
var dinoRun = [
  {'name':'walk01', 'frame':{'x':131.33, 'y': 238.75, 'width': 149, 'height': 149.42}},
  {'name':'walk02', 'frame':{'x':298.12, 'y': 235.85, 'width': 149, 'height': 149.42}},
  {'name':'walk03', 'frame':{'x':478.91, 'y': 240.2, 'width': 151, 'height': 149.42}},
  {'name':'walk04', 'frame':{'x':83.53, 'y': 429.37, 'width': 149, 'height': 149.5}},
  {'name':'walk05', 'frame':{'x':280.28, 'y': 429.37, 'width': 149, 'height': 149.5}},
  {'name':'walk06', 'frame':{'x':481.06, 'y': 437.61, 'width': 149, 'height': 149.42}},
]
var dinoJump = [
  {'name':'jump', 'frame':{'x':69.96, 'y':631.23, 'width':128.62, 'height': 168.3}}
]
var dinoFall = [
  {'name':'jump', 'frame':{'x':264.95, 'y':656, 'width':162.08, 'height': 144.01}}
]

class dino {
  constructor(startX, startY, runAnim, jumpAnim, fallAnim, gravity, floorSprite, floorSprite2, jumpSpeed) {
    this.dinosaur = createSprite(startX, startY)
    this.dinosaur.addAnimation("run", runAnim);
    this.dinosaur.addAnimation("jump", jumpAnim);
    this.dinosaur.addAnimation("fall", fallAnim)
    this.dinosaur.changeAnimation("run")
    this.gravity = gravity;
    this.jumpSpeed = jumpSpeed;
    this.currentState = "run";
    this.floorSprite = floorSprite;
    this.floorSprite2 = floorSprite2;
    //this.dinosaur.debug = true;
    this.dinosaur.setCollider("rectangle", 0, 0, this.dinosaur.width, this.dinosaur.height)
  }

  update() {
    this.dinosaur.setCollider("rectangle", 0, 0, this.dinosaur.width, this.dinosaur.height)

    this.colliding = false;
    if(this.dinosaur.collide(this.floorSprite) || this.dinosaur.collide(this.floorSprite2)) {
      //colliding with floor, cancel out stuff
      this.dinosaur.position.y -= 1;
      this.dinosaur.velocity.y = 0;
      this.currentState = "run";
    }
    if(this.dinosaur.position.y+(this.dinosaur.height/2) > this.floorSprite.y+(this.floorSprite.height/2)) {
      console.log("unda the tree")
      this.dinosaur.addSpeed(this.gravity, -90)
      this.dinosaur.y--;
    }
    this.dinosaur.addSpeed(this.gravity, 90)
    

    //if the dinosaur is falling, make it fall
    if(this.currentState == "fall") {
      this.dinosaur.changeAnimation("fall");
    } else if(this.currentState == "jump") {
      this.dinosaur.changeAnimation("jump");
    } else if(this.currentState == "run") {
      this.dinosaur.changeAnimation("run");
    }
  }

  display() {
    drawSprites()
  }

  collision() {
    //Soon-Tm
  }

  handleKeypressed() {
    if(keyIsDown(UP_ARROW) && this.currentState == "run") {
      this.dinosaur.velocity.y -= this.jumpSpeed;
      this.currentState = "jump";
    } else if(keyCode == DOWN_ARROW && this.currentState != "run" && this.dinosaur.collide(this.floorSprite) == false && this.dinosaur.collide(this.floorSprite2) == false) {
      this.dinosaur.addSpeed(this.gravity*1.5, 90)
      this.currentState = "fall"
    } 
  }
}

class obstacle {
  //obstacle moves from right to the left
  //if at the very left it disappears
  //amogusus
  constructor(startX, startY, obstacleImg, speed) {
    this.obstacle = createSprite(startX, startY)
    this.obstacle.addAnimation("normal", obstacleImg)
    this.obstacle.changeAnimation("normal")
    this.obstacle.velocity.x = speed;
  }
}


function preload() {
  forestbg1 = loadImage("forest/backgrounds/forestbg.jpg")
  forestbg2 = loadImage("forest/backgrounds/forestbg2.jpg")
  forestfloor = loadImage("forest/ground/forestground.jpg")
  forestfloor.resize(300, 100);
  runAnimation = loadSpriteSheet('dinosaur/dinosaur-spritesheet.png', dinoRun)
  fallAnimation = loadSpriteSheet('dinosaur/dinosaur-spritesheet.png', dinoFall)
  jumpAnimation = loadSpriteSheet('dinosaur/dinosaur-spritesheet.png', dinoJump)
}

function setup() {
  //create the world
  var cnv = createCanvas(wWidth, wHeight);
  var x = (windowWidth - width) / 2;
  var y = ((windowHeight - height) / 2) + 50;
  cnv.position(x, y);
  
  imageMode(CORNER);
  //floor sprite, will use for floor collision and dinosaur
  floor1 = createSprite(wWidth*0.5, wHeight-60);
  floor2 = createSprite(wWidth*1.5, wHeight-60)
  
  floor1.addAnimation('normal', forestfloor);
  floor2.addAnimation('normal', forestfloor);

  floor1.changeAnimation('normal');
  floor2.changeAnimation('normal');
  floor1.setCollider('rectangle', 0, 0, floor1.width, floor1.height);
  floor2.setCollider('rectangle', 0, 0, floor2.width, floor2.height);
  //change frame rate for CONSISTENCY
  frameRate(fr);

  //dinosaur
  dino1 = new dino(wWidth/4, wHeight-400, runAnimation, jumpAnimation, fallAnimation, 1, floor1, floor2, 19)
}

function draw() {
  
  //background here
  image(forestbg1, x1, 0, wWidth, wHeight)
  image(forestbg2, x2, 0, wWidth, wHeight)
  //bring it back now yall
  if(floor1.position.x <= -wWidth/1.8) {
    floor1.position.x = wWidth*1.6;
  } else if(floor2.position.x <= -wWidth/1.8) {
    floor2.position.x = wWidth*1.6;
  
  }
  //put other background in front if too far
  if(x1 <= -wWidth) {
    x1 = wWidth;
  } else if(x2 <= -wWidth) {
    x2 = wWidth;
  }
  
  dino1.update()
  dino1.handleKeypressed()
  
  //console.log(dino1.dinosaur.position.y)
  //console.log(dino1.dinosaur.position.x)
  x1 -= wWidth/(fr*2);
  x2 -= wWidth/(fr*2);
  floor1.velocity.x = -wWidth/fr;
  floor2.velocity.x = -wWidth/fr;
  drawSprites()
}