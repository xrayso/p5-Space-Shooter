//Author: Josh Ossip

let stars = [];
let moveRight = false;
let firstShot = 0;
let moveLeft = false;
let moveUp = false;
let moveDown = false;
let shoot = false;
let rotateLeft = false;
let rotateRight = false;
let superShot = false;
let gameover = false;
let setScore = false;
let level;
let highscore = 0;
let ship;
let enemy;
let p;
let powerUps = [];
let gameModeSelected = false;

let tutorialShip;
let tutorialEnemy;
let depth = 0;
let stage = 0;

function setup() {
  textFont("Times New Roman");
  createCanvas(windowWidth - 1, windowHeight - 1);
  background(0);

  ship = new Ship(width / 2, height - 95, TWO_PI, [], true);
  level = new Level(1, [ship]);
  if (level) ship.enemies = level.ships;
  ship.health = 10;

  gameover = false;
  setScore = false;

  tutorialShip = new Ship(width / 2, height / 2, TWO_PI, [], true);
  tutorialShip.health = 20;
  tutorialEnemy = new Ship(width / 2, height / 3, PI, [tutorialShip]);
  tutorialEnemy.fireRate = 60;
}

function draw() {
  background(0);
  star();
  if (gameover) {
    gameOver();
    textAlign(CENTER);
    textSize(37);
    if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100) {
      if (mouseY > height - 150 && mouseY < height - 15) {
        textSize(45);
        if (mouseIsPressed) {
          setup();
        }
      }
    }
    text("Play Again", width / 2, height - 75);
    if (highscore >= level.difficulty && !setScore) {
      text("High Score " + highscore, width / 2, height - 35);
    } else {
      text("New Record: " + level.difficulty, width / 2, height - 35);
      if (!setScore) {
        highscore = level.difficulty;
        setScore = true;
      }
    }
    return;
  }

  if (!gameModeSelected) {
    fill(255);
    textAlign(CENTER);
    let playSize = 37;
    let tutorialSize = 37;
    if (mouseY > height / 2 - 35 && mouseY < height / 2 + 15) {
      if (mouseX > width / 2 - 250 && mouseX < width / 2 - 150) {
        playSize = 45;
        if (mouseIsPressed) {
          gameModeSelected = "GAME";
        }
      } else if (mouseX > width / 2 + 125 && mouseX < width / 2 + 275) {
        tutorialSize = 45;
        if (mouseIsPressed) {
          gameModeSelected = "TUTORIAL";
        }
      }
    }
    textSize(playSize);
    text("Play", width / 2 - 200, height / 2);
    textSize(tutorialSize);
    text("Tutorial", width / 2 + 200, height / 2);
    return;
  }
  if (gameModeSelected == "TUTORIAL") {
    if (stage < 1) stage = 1;
    if (stage < 5){
      tutorialShip.powerUps = [];
    }
    tutorialShip.update();
    if (stage < 4) {
      tutorialShip.specialShot = 0;
    }
    tutorialShip.show("blue");
    textSize(37);
    if (stage == 1) {
      coolText(
        "USE W.A.S.D TO MOVE TO THE TARGET",
        depth,
        width / 2 - 350,
        100
      );
      if (frameCount % 5 == 0) {
        depth++;
      }
    }
    if (depth > 35 || stage > 1) {
      keyBinds(tutorialShip);
    }
    if (stage == 1 && depth > 35) {
      if (stage == 1) {
        const targetPos = createVector(width / 2, height - 95);
        const centre = createVector(width / 2, height / 2);
        fill(255, 0, 0);
        circle(width / 2, height - 95, 32);
        fill(255);
        circle(width / 2, height - 95, 22);
        fill(255, 0, 0);
        circle(width / 2, height - 95, 8);
        if (tutorialShip.pos.dist(targetPos) < tutorialShip.width / 2 + 16) {
          stage = 2;
          depth = 0;
        }
      }
    } else if (stage > 1) {
      followMouse(tutorialShip);
      if (stage == 2) {
        coolText("USE YOUR MOUSE TO AIM AT THE ENEMY SHIP", depth, 10, 100);
        coolText("CLICK TO FIRE", depth - 40, 300, 175);
        if (frameCount % 5 == 0) {
          depth++;
        }
        if (depth > 50) {
          if (tutorialShip.enemies.length == 0) {
            tutorialShip.enemies.push(tutorialEnemy);
          }
          tutorialEnemy.update();
          tutorialEnemy.show("red");
          if (tutorialEnemy.health <= 0) {
            stage = 3;
            depth = 0;
            tutorialEnemy = new Ship(width / 2, height / 3, PI, [tutorialShip]);
            tutorialEnemy.fireRate = 60;
          }
        }
      }
      if (stage > 2) {
        texts(tutorialShip);
        if (stage == 3) {
          coolText("TRY NOT TO GET HIT", depth, 250, 100);
          if (frameCount % 5 == 0) {
            depth++;
          }
          if (depth > 24) {
            if (depth > 120 && tutorialShip.canons[0].shots.length == 0) {
              coolText("BTW YOU CAN SHOOT IT", depth - 120, 200, 140);
            }
            tutorialShip.enemies.push(tutorialEnemy);
            tutorialEnemy.update();
            tutorialEnemy.show("red");
            Bot.aim(tutorialEnemy);
            Bot.dodge(tutorialEnemy);
            if (frameCount % tutorialEnemy.fireRate == 0) {
              tutorialEnemy.shoot();
            }

            if (tutorialShip.health <= 0) {
              setup();
            }
            if (tutorialEnemy.health <= 0) {
              stage = 4;
              depth = 0;
              tutorialShip.specialShot = 600;
            }
          }
        }
        if (stage == 4){
          strokeWeight(1);
          textSize(32)
          coolText("THE BAR IN THE BOTTOM LEFT WILL FILL UP", depth, 20, 100);
          coolText("ONCE IT DOES PRESS SPACE TO USE THE POWER", depth-40, 5, 140);
          if (frameCount % 5 == 0) {
            depth++;
          }
          if (tutorialShip.superCanons[0].shots.length > 0){
            stage = 5;
            depth = 0;
            
          } 
        }
        if (stage == 5){
          coolText("THE RED DOTS FLOATING AROUND WILL GIVE", depth, 5, 100);
          coolText("YOU AN EXTRA LIFE AND ADD A CANON", depth-40, 5, 130);
          coolText("ON YOUR SHIP. TRY YOUR BEST TO COLLECT THEM", depth-75, 5, 160);
          if (frameCount % 5 == 0) {
            depth++;
          }
          if (depth == 120 || depth == 200){
            let x = random(width);
            let y = random(height);
            tutorialShip.powerUps.push(new PowerUp(x, y));
          }
          if (tutorialShip.canons.length > 2 && depth > 150){
            stage = 6;
            depth = 0;
          }
        }
        if (stage == 6){
          coolText("YOU ARE FINALLY READY", depth, 100, 100);
          coolText("GOOD LUCK ", depth-25, 140, 140);
          if (frameCount % 10 == 0) {
            depth++;
          }
          if (depth > 65){
            gameModeSelected = undefined;
            setup();
          } 
        }
        
      }
    }
    return;
  }
  fill(255, 0, 0);
  textSize(32);

  followMouse(ship);
  ship.update();
  ship.show('blue');
  if (level) {
    if (level.reset) {
      if (level.difficulty % 5 == 0) {
        if (ship.fireRate > 1) {
          ship.fireRate--;
        }
      }
      level = new Level(level.difficulty + 1, level.targets);
      ship.setEnemies(level.ships);
      if (ship.maxSpeed < 4) {
        ship.maxSpeed += 0.1;
      }
    }
    level.run();
  }
  keyBinds(ship);
  texts(ship, level);
  if (ship.health <= 0) gameover = true;
}

function keyBinds(s) {
  if (moveRight ^ moveLeft) {
    if (moveRight) {
      s.vel.x++;
    }
    if (moveLeft) {
      s.vel.x--;
    }
  } else {
    s.vel.x = 0;
  }
  if (moveUp ^ moveDown) {
    if (moveUp) {
      s.vel.y--;
    }
    if (moveDown) {
      s.vel.y++;
    }
  } else {
    s.vel.y = 0;
  }
  if (rotateRight ^ rotateLeft) {
    if (rotateRight) {
      s.turn(0.05);
    }
    if (rotateLeft) {
      s.turn(-0.05);
    }
  }
  if (mouseIsPressed) {
    firstShot++;
    if (firstShot == 1 || firstShot % s.fireRate == 0) {
      s.shoot();
    }
  } else {
    firstShot = 0;
  }
  if (superShot) {
    if (s.specialShot == 1200) {
      s.superShot();
    }
  }
}
function keyReleased() {
  key = key.toLowerCase();
  if (key === "d") {
    moveRight = false;
  }
  if (key === "a") {
    moveLeft = false;
  }
  if (key === "w") {
    moveUp = false;
  }
  if (key === "s") {
    moveDown = false;
  }
  if (key === "z") {
    rotateLeft = false;
  }
  if (key === "x") {
    rotateRight = false;
  }
  if (key === " ") {
    superShot = false;
  }
}
function keyPressed() {
  key = key.toLowerCase();
  if (key === "d") {
    moveRight = true;
  }
  if (key === "a") {
    moveLeft = true;
  }
  if (key === "w") {
    moveUp = true;
  }
  if (key === "s") {
    moveDown = true;
  }
  if (key === "z") {
    rotateLeft = true;
  }
  if (key === "x") {
    rotateRight = true;
  }
  if (key === " ") {
    superShot = true;
  }
}
function texts(ship, level) {
  textAlign(LEFT);
  textSize(32);
  stroke(255);
  strokeWeight(2);
  fill(255, 0, 0);
  text("Lives: " + max(ship.health, 0), 5, 50);
  if (level) {
    textAlign(RIGHT);
    fill(0, 255, 0);
    text("Level: " + level.difficulty, width - 5, 50);

    textAlign(CENTER);
    fill(255);
    text("HIGH SCORE: " + highscore, width / 2, 30);
  }
}
function followMouse(ship) {
  let v1 = createVector(ship.pos.x, 0);
  let v2 = createVector(mouseX - ship.pos.x, mouseY - ship.pos.y);
  let newAngle = v1.angleBetween(v2) + PI / 2;
  ship.turn(newAngle - ship.angle);
}
function star() {
  if (stars.length == 0) {
    for (let i = 0; i < 100; i++) {
      stars.push(createVector(random(width), random(height), random(200)));
    }
  }
  stroke(255);
  for (let i = 0; i < stars.length; i++) {
    strokeWeight(map(stars[i].z, 0, 200, 3, 1));
    point(stars[i].x, stars[i].y);
  }
}

function gameOver() {
  if (level) {
    textAlign(CENTER);
    fill(255);
    textSize(64);
    text("Level " + level.difficulty, width / 2, height / 2);
    textAlign(LEFT);
  }
}
function coolText(txt, d, x, y) {
  noStroke();
  textAlign(LEFT);
  textSize(35);
  fill(0, 255, 0);
  text(txt.substring(0, d), x, y);
}
