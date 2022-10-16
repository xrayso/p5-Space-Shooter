class Ship{
  constructor(x, y, angle, enemies, player, buddy){
    this.player = player;
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.maxSpeed = 2;
    this.health = 1;
    this.length = 30;
    this.width = 30;
    this.enemies = enemies;
    this.canons = [];
    this.powerUps = [];
    this.angle = angle;
    this.buddies = [];
    this.dodge = false;
    this.aim = false;
    this.superCanons = [];
    this.specialShot = 0;
    if (player && !buddy){
      for (let i = 0; i < TWO_PI; i+=0.1){
       this.superCanons.push(new Canon(this.pos.x, this.pos.y, i, this));
      }
    }
    this.canons.push(new Canon(this.pos.x-this.length/3, this.pos.y, this.angle, this));
    this.canons.push(new Canon(this.pos.x+this.length/3, this.pos.y, this.angle, this));
    this.buddy = buddy;
    if (buddy){
      this.length*=0.6;
      this.width*=0.6;
    }
    this.fireRate = 12;
  }
  show(colour){
    if (this.health <= 0) return;
    noStroke();
    for (let i = 0; i < this.canons.length; i++){
      this.canons[i].show();
    }
    for (let i = 0; i < this.powerUps.length; i++){
      this.powerUps[i].show();
    }
    for (let i = 0; i < this.buddies.length; i++){
      this.buddies[i].show();
    }
    noStroke();
    fill(255);
    push();
    translate(this.pos.x, this.pos.y);

    rectMode(CENTER);
    rotate(this.angle);
    if (colour) fill(colour);
    ellipse(0, 0, this.length, this.width);
    pop();
  for (let i = 0; i < this.superCanons.length; i++){
      this.superCanons[i].show(true);
    }
    if (this.player && !this.buddy) this.specialPowerTimer();

  }
  update(){
    if (this.health <= 0) return;
    if (this.boss) this.bossBar();
    for (let i = 0; i < this.buddies.length; i++){
      this.buddies[i].maxSpeed = this.maxSpeed;
    }
    for (let i = this.enemies.length - 1; i >= 0; i--){
      if (this.enemies[i].health <= 0) this.enemies.splice(i, 1);
    }
    this.vel.add(this.acc);
    this.acc.mult(0);
    this.vel.limit(this.maxSpeed);
    if (! this.buddy){
      if (this.pos.x >= width-this.length/2 && this.vel.x > 0) this.vel.x = 0;
      if (this.pos.x <= this.length/2 && this.vel.x < 0) this.vel.x = 0;

      if (this.pos.y >= height-this.width/2 && this.vel.y > 0) this.vel.y = 0;
      if (this.pos.y <= this.width/2 && this.vel.y < 0) this.vel.y = 0;
    }
    this.pos.add(this.vel);
    for (let i = 0; i < this.canons.length; i++){
      this.canons[i].update();
    }
    for (let i = 0; i < this.superCanons.length; i++){
      this.superCanons[i].update();
    }
    for (let i = 0; i < this.buddies.length; i++){
      this.buddies[i].vel = this.vel;
      this.buddies[i].acc = this.acc;
      this.buddies[i].angle = this.angle;
      this.buddies[i].update();
    }

    if (random() < 0.001 && this.player && !this.buddy && this.powerUps.length < 5){
      let x = random(width);
      let y = random(height);
      this.powerUps.push(new PowerUp(x, y));
    }
    for (let i = this.powerUps.length-1; i>=0; i--){
      this.powerUps[i].update();
      if (this.pos.dist(this.powerUps[i].pos) <= this.length/2 + this.powerUps[i].r){
        this.powerUp(this.powerUps[i]); 
        this.powerUps.splice(i, 1);
      }
    }
    for (let i = this.buddies.length - 1; i >= 0; i--){
      if (this.buddies[i].health <= 0){
        this.buddies.splice(i, 1)
        level.targets.splice(level.targets.indexOf(this.buddies[i]), 1);
      }
    }
    this.specialShot = min(this.specialShot+1, 1200);
  }
  turn(a){
    for (let i = 0; i < this.canons.length; i++){
      this.canons[i].angle += a;
    }
    for (let i = 0; i < this.buddies.length; i++){
      this.buddies[i].turn(a);
    }
    this.angle+=a;
  }
  shoot(){
    for (let canon of this.canons){
        canon.shoot();
    }
    for (let i = 0; i < this.buddies.length; i++){
      this.buddies[i].shoot();
    }
  }
  setEnemies(e){
    this.enemies = e;
    for (let i = 0; i < this.buddies.length; i++){
      this.buddies[i].enemies = e;
    }
  }
  static randomShip(x, y, enemies, difficulty){
    x = x || random(width);
    y = y || random(height);
    let angle = random(TWO_PI);
    enemies = enemies || [];
    let randomShips = []
    let ship = new Ship(x, y, angle, enemies);
    for (let i = 0; i < random(difficulty); i++){
      ship.canons.push(new Canon(ship.pos.x, ship.pos.y, random(TWO_PI), ship));
    }
    ship.fireRate = 50;
    randomShips.push(ship);
    return random(randomShips);
  }
  static randomBoss(difficulty){
    let x = width / 2;
    let y = 100;
    let angle = random(TWO_PI);
    let ship = new Ship(x, y, angle);
    ship.canons = [];
    for (let i = 0; i < TWO_PI; i+=TWO_PI/difficulty){
      ship.canons.push(new Canon(x, y, i, ship));
    }
    ship.length = 40;
    ship.width = 40;
    ship.health = 20;
    ship.dodge = true;
    ship.boss = true;
    return ship;
  }
  powerUp(p){
    if (p.value < 1 || level){
      let canonX = random(-this.length/2, this.length/2) + this.pos.x;
      let canonY = random(-this.width/2, this.width/2) + this.pos.y;
      this.canons.push(new Canon(canonX, canonY, random(TWO_PI), this));
    }else if (p.value < 2){
      this.maxSpeed+= 0.2;
    }else if (p.value < 4 && this.buddies.length < 2){
      let posY = this.pos.y;
      let angle = this.angle;
      let enemies = this.enemies;
      let posX;
      if (this.buddies.length > 0){
        if (this.buddies[0].pos.x < this.pos.x){
          posX = this.pos.x + this.length*2;
        }else{
          posX = this.pos.x - this.length*2;
        }
      }else{
        posX = this.pos.x - this.length*2;
      }
      let bud = new Ship(posX, posY, angle, enemies, this.player, true);
      if (level){
        level.targets.push(bud);
      }
      this.buddies.push(bud);
    }
    
    else if (p.value < 5){
      if (this.shotTime <= 1){
        this.shotTime = 1;
      }else{
        this.shotTime--;
      }
    }else if (p.value < 6){
      //shotpower++
    }
    if (random(1) < 2){
      this.health++;
    }
  }
  superShot(){
    for (var canon of this.superCanons){
      canon.shoot();
    }
    this.specialShot = 0;
  }
  
  bossBar(){
    textAlign(CENTER);
    text("Boss", width/2, 40);
    noStroke();
    fill(255, 0, 0);
    let healthX = map(this.health, 0, 20, 0, 150);
    rect(width/2 - 75, 45, healthX, 20);
    noFill();
    stroke(255);
    textAlign(LEFT);
    rect(width/2 - 75, 45, 150, 20);
  }
  specialPowerTimer(){
    noStroke();
    strokeWeight(1);
    fill(0, 255, 255);
    let specialY = map(this.specialShot, 0, 1200, 0, 100);
    rect(10, height-5, 20, -specialY);
    noFill();
    stroke(255);
    rect(10, height-5, 20, -100);
    textAlign(LEFT);
    if (specialY == 100){
      // if (frameCount % 5 == 0) return;
      textSize(20);
      fill(255, 0, 0);
      noStroke();
      text("Power Up Ready (space)", 10, height - 20);
    }
  }
}