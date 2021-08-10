//window dimensions
wHeight = 500;
wWidth = 500;

//background scrolling positions
x1 = wWidth;
x2 = 0;
fr = 30;

var dinoRun = [
  {'name':'walk01', 'frame':{'x':0, 'y': 0, 'width': 201, 'height': 202}},
  {'name':'walk02', 'frame':{'x':200, 'y': 0, 'width': 201, 'height': 202}},
  {'name':'walk03', 'frame':{'x':402, 'y': 1, 'width': 201, 'height': 202}},
  {'name':'walk04', 'frame':{'x':0, 'y': 202, 'width': 201, 'height': 202}},
  {'name':'walk05', 'frame':{'x':200, 'y': 203, 'width': 201, 'height': 202}},
  {'name':'walk06', 'frame':{'x':400, 'y': 203, 'width': 201, 'height': 202}},
]
var dinoJump = [
  {'name':'jump', 'frame':{'x':0, 'y':404, 'width':182, 'height': 229}}
]
var dinoFall = [
  {'name':'jump', 'frame':{'x':184, 'y':403, 'width':219, 'height': 217}}
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
    this.dinosaur.debug = true;
  }

  changeState() {
    //check if falling, is the velocity up
    if(this.dinosaur.velocity.y >= 0 && this.floorSprite.overlapPoint(this.dinosaur.position.x, this.dinosaur.position.y+105)==false || this.floorSprite2.overlapPoint(this.dinosaur.position.x, this.dinosaur.position.y+101) == false) {
      this.currentState = "fall";
    /*check if jump*/} else if(this.dinosaur.velocity.y <= 0 && this.floorSprite.overlapPoint(this.dinosaur.position.x, this.dinosaur.position.y+101)==false || this.floorSprite2.overlapPoint(this.dinosaur.position.x, this.dinosaur.position.y+101) == false) {
      this.currentState = "jump";
    /*Check if run*/} else if(this.dinosaur.velocity.y == 0 && this.floorSprite.overlapPoint(this.dinosaur.position.x, this.dinosaur.position.y+101) || this.floorSprite2.overlapPoint(this.dinosaur.position.x, this.dinosaur.position.y+101)) {
      this.currentState = "run";
      this.dinosaur.velocity.y = 0;
    }
  }

  update() {
    //touch the floor - byebye goes velocity
    //this if statement is certified to work
    if(this.floorSprite.overlapPoint(this.dinosaur.position.x, this.dinosaur.position.y+101) || this.floorSprite2.overlapPoint(this.dinosaur.position.x, this.dinosaur.position.y+101)) {
      this.dinosaur.position.y--;
      this.dinosaur.velocity.y = 0;
    }
    //if the dinosaur is falling, make it fall
    if(this.currentState == "fall") {
      this.dinosaur.changeAnimation("fall");
    } else if(this.currentState == "jump") {
      this.dinosaur.addSpeed(this.gravity, 90);
      this.dinosaur.changeAnimation("jump");
    } else if(this.currentState == "run") {
      this.dinosaur.changeAnimation("run")
    }
    this.dinosaur.addSpeed(this.gravity, 90);
  }

  display() {
    drawSprites()
  }

  collision() {
    //Soon-Tm
  }

  handleKeypressed() {
    if(keyCode == UP_ARROW && this.currentState == "run") {
      this.dinosaur.velocity.y += this.jumpSpeed;
    } else if(keyCode == DOWN_ARROW && this.currentState != "run") {
      this.dinosaur.addSpeed(this.gravity*2, 90)
    }
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
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
  
  imageMode(CORNER);
  //floor sprite, will use for floor collision and dinosaur
  floor1 = createSprite(wWidth*0.5, wHeight-60);
  floor2 = createSprite(wWidth*1.5, wHeight-60)
  floor1.debug = true;
  floor2.debug = true;
  floor1.addAnimation('normal', forestfloor);
  floor2.addAnimation('normal', forestfloor);

  floor1.changeAnimation('normal');
  floor2.changeAnimation('normal');
  floor1.setCollider('rectangle', 0, 0, wWidth, 200);
  floor2.setCollider('rectangle', 0, 0, wWidth, 200);
  //change frame rate for CONSISTENCY
  frameRate(fr);

  //dinosaur
  dino1 = new dino(wWidth/2, wHeight-500, runAnimation, jumpAnimation, fallAnimation, 1, floor1, floor2, 10)
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
  
  dino1.changeState()
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