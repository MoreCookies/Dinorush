//window dimensions
wHeight = 500;
wWidth = 500;

//background scrolling positions
x1 = wWidth;
x2 = 0;
fr = 30;
var frameCounter = 0;
var time = 0;
let obstacleInterval;
let randomObject;
var time2 = 0;
var decorations = [];
var obstacles = [];
var randomInterval;
function atLeft(x, width) {
  if(x+(width/2) < 0) {
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
    if(this.currentState != "dead") {
      this.dinosaur.setCollider("rectangle", 0, 0, this.dinosaur.width, this.dinosaur.height)
      if(this.dinosaur.velocity.y > 0 && this.floorSprite.overlapPixel(this.dinosaur.position.x, this.dinosaur.position.y+this.dinosaur.height/2+3) == false && this.floorSprite2.overlapPixel(this.dinosaur.position.x, this.dinosaur.position.y+this.dinosaur.height/2+3) == false) {
        this.currentState = "fall";
      } else if(this.dinosaur.velocity.y < 0) {
        this.currentState = "jump";
      }
      if(this.dinosaur.collide(this.floorSprite) || this.dinosaur.collide(this.floorSprite2)) {
        //colliding with floor, cancel out stuff
        this.dinosaur.position.y -= 1;
        this.dinosaur.velocity.y = 0;
        this.currentState = "run";
      }
      this.dinosaur.addSpeed(this.gravity, 90)
      
      if(this.dinosaur.position.y+(this.dinosaur.height/2) > this.floorSprite.y+(this.floorSprite.height/2)) {
        this.dinosaur.addSpeed(this.gravity, -90)
        this.dinosaur.y--;
      }
      

      //if the dinosaur is falling, make it fall
      if(this.currentState == "fall") {
        this.dinosaur.changeAnimation("fall");
      } else if(this.currentState == "jump") {
        this.dinosaur.changeAnimation("jump");
      } else if(this.currentState == "run") {
        this.dinosaur.changeAnimation("run");
      }
    }
    
  }

  display() {
    drawSprites()
  }

  collision(obstacleList) {
    //if bottom right corner is touching anything, *die*
    //if top right corner is touching anything, die
    //ANOGUSIHCXZh
    
    for(var u = 0; u < obstacleList.length; u++) {
      /*
      if(this.obstacleList[u].obstacle.collide(this.dinosaur.position.x+(this.dinosaur.width/2), this.dinosaur.position.y+(this.dinosaur.height/2))) {
        this.currentState = "dead";
      }
      if(this.obstacleList[u].obstacle.collide(this.dinosaur.position.x+(this.dinosaur.width/2), this.dinosaur.position.y+(this.dinosaur.height/2))) {
        this.currentState = "dead";
      }
      */
      //Check top right corner (birds and stuff)
      //Check bottom right corner (most obstacles)
      //check
      if(obstacleList[u].obstacle.overlapPixel(this.dinosaur.position.x+(this.width/2), this.dinosaur.position.y+(this.height/2))) {
        //bottom right pixel
        this.currentState = "dead";
        console.log("oops, you did the die")
      }
      if(obstacleList[u].obstacle.overlapPixel(this.dinosaur.position.x+(this.width/2), this.dinosaur.position.y-(this.height/2))) {
        //top right pixel
        this.currentState = "dead";
        console.log("oops, you did the die")
      }
      if(obstacleList[u].obstacle.overlapPixel(this.dinosaur.position.x-(this.width/2), this.dinosaur.position.y+(this.height/2))) {
        //bottom left pixel
        this.currentState = "dead";
        console.log("oops, you did the die")
      }
      if(obstacleList[u].obstacle.overlapPixel(this.dinosaur.position.x-(this.width/2), this.dinosaur.position.y-(this.height/2))) {
        //top left pixel
        this.currentState = "dead";
        console.log("oops, you did the die")
      }
      if(this.currentState == "dead") {
        this.dinosaur.velocity.y = 0;
        this.dinosaur.velocity.x = 0;
      }
    }
  }

  handleKeypressed() {
    if(this.currentState != "dead") {
      if(keyIsDown(UP_ARROW) && this.currentState == "run") {
        this.dinosaur.velocity.y -= this.jumpSpeed;
        this.currentState = "jump";
      } else if(keyCode == DOWN_ARROW && this.currentState != "run" && this.dinosaur.collide(this.floorSprite) == false &&        this.dinosaur.collide(this.floorSprite2) == false) {
        this.dinosaur.addSpeed(this.gravity*2, 90)
        this.currentState = "fall"
      }
    } 
  }
}

class obstacle {
  //obstacle moves from right to the left
  //if at the very left it disappears
  //amogusus
  constructor(startX, startY, obstacleImg, speed, widthI, heightI) {
    this.obstacle = createSprite(startX, startY, widthI, heightI)
    this.dispImg = obstacleImg;
    this.dispImg.resize(widthI, heightI);
    this.obstacle.addImage("normal", this.dispImg)
    this.obstacle.changeAnimation("normal")
    this.obstacle.velocity.x = -speed;
    this.obstacle.setCollider("rectangle", 0, 0, widthI, heightI)
  }
  
  update() {
    if(this.obstacle.position.x-(this.obstacle.width/2) <= 0) {
      this.obstacle.remove();
    }
  }
}


function preload() {
  //forest bgs
  forestbg1 = loadImage("forest/backgrounds/forestbg.jpg")
  forestbg2 = loadImage("forest/backgrounds/forestbg2.jpg")
  //forest ground
  forestfloor = loadImage("forest/ground/forestground.jpg")
  
  //deep forest obstacles
  fireImg = loadImage("forest/obstacles/fire.png")
  grassImg = loadImage("forest/obstacles/grass.png")
  rockImg = loadImage("forest/obstacles/rock.png")
  tentImg = loadImage("forest/obstacles/tent.png")
  treeImg = loadImage("forest/obstacles/tree.png")
  
  //resize le obstacles
  fireImg.resize(35, 40);
  grassImg.resize(15, 30)
  rockImg.resize(25, 24);
  tentImg.resize(65, 65);
  treeImg.resize(75, 90);
  //plains forest
  //other trees idk

  //default dino animations
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
  obstacleInterval = round(random(3, 5));
  //make le vars
  randomInterval = round(random(1, 2.51))
  imageMode(CORNER);
  //floor sprite, will use for floor collision and dinosaur
  floor1 = createSprite(wWidth*0.5, wHeight-60);
  floor2 = createSprite(wWidth*1.5, wHeight-60)
  forestfloor.resize(wWidth, 50);
  floor1.addImage('normal', forestfloor);
  floor2.addImage('normal', forestfloor);

  floor1.changeAnimation('normal');
  floor2.changeAnimation('normal');
  floor1.setCollider('rectangle', 0, 0, floor1.width, floor1.height);
  floor2.setCollider('rectangle', 0, 0, floor2.width, floor2.height);
  //change frame rate for CONSISTENCY
  frameRate(fr);
  //dinosaur
  dino1 = new dino(wWidth/4, wHeight-400, runAnimation, jumpAnimation, fallAnimation, 1, floor1, floor2, 16)
  
}

function draw() {
  second = (frameCounter % fr);
  if(second >= 29) {
    time += 1;
    second = 0;
  }
  if(time % 2 == 0) {
    time2 += 1;
  }
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
  randomObject = random(0, 2)
  
  if(randomObject <= 1.8 && randomInterval == time2) {
    randomInterval = round(random(1, 2.51))
    decorations.push(new obstacle(wWidth+5, wHeight-floor1.height+27, grassImg, wWidth/fr, 15, 30));
    time2 = 0;
    
  } else if(randomObject <= 3 && randomInterval == time2) {
    randomInterval = round(random(1, 2.51))
    decorations.push(new obstacle(wWidth+5, wHeight-floor1.height+25, rockImg, wWidth/fr, 25, 24));
    time2 = 0;
  }

  if(time >= obstacleInterval) {
    for(var e = 0; e < round(random(1, 3.1)); e++) {
      randomObstacle = random(0, 3)
      if(randomObstacle <= 2) {
        obstacles.push(new obstacle(wWidth+5+(75*e), wHeight-floor1.height-20, treeImg, wWidth/fr, 75, 90));
      } else if(randomObstacle <= 2.5) {
        obstacles.push(new obstacle(wWidth+5+(50*e), wHeight-floor1.height-15, tentImg, wWidth/fr, 50, 90));
      } else if(randomObstacle <= 3) {
        obstacles.push(new obstacle(wWidth+5+(35*e), wHeight-floor1.height+10, fireImg, wWidth/fr, 35, 40));
      }
    }
    obstacleInterval = round(random(3, 5));
    time = 0;
  }
  for(var i = 0; i < obstacles.length; i++) {
    if(atLeft(currentSprite.position.x, currentSprite.width) || obstacles.length >= 25) {
      //remove current obstacle at index
      obstacles[i].update()
      obstacles.shift();
      
    }
  }
  for(var p = 0; p < 10; p++) {
    for(var f = 0; f < decorations.length; f++) {
      currentSprite = decorations[f].obstacle;
      if(atLeft(currentSprite.position.x, currentSprite.width) || decorations.length >= 75) {
        //remove current obstacle at index
        decorations.shift();
        currentSprite.remove();
      }
    }
  }
  //stego amirite
  dino1.update()
  dino1.handleKeypressed()
  dino1.collision(obstacles)
  
  //console.log(dino1.dinosaur.position.y)
  //console.log(dino1.dinosaur.position.x)
  x1 -= wWidth/(fr*2);
  x2 -= wWidth/(fr*2);
  floor1.velocity.x = -wWidth/fr;
  floor2.velocity.x = -wWidth/fr;
  drawSprites()
  frameCounter += 1;
}