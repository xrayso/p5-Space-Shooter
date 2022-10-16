class Canon{
  constructor(x, y, angle, ship){
    this.pos = createVector(x, y);
    this.ship = ship;
    this.angle = angle;
    this.shots = [];
    this.r = this.pos.x - this.ship.pos.x;
    this.offSet = createVector();
    this.offSet.x = this.r * cos(this.angle) + this.ship.pos.x;
    this.offSet.y = this.r * sin(this.angle) + this.ship.pos.y;
  }
  show(onlyShot){
    for (let i = 0; i < this.shots.length; i++){
      this.shots[i].show();
    }
    if (onlyShot) return;
    stroke(255, 0, 0);
    push();
    strokeWeight(3);
    translate(this.ship.pos.x, this.ship.pos.y);
    rotate(this.angle);
    const xPos = this.pos.x - this.ship.pos.x;
    const yPos = this.pos.y - this.ship.pos.y;
    let length = this.ship.buddy ? 18 : 30;
    line(xPos, yPos, xPos, yPos - length);
    pop();

  }
  update(){
    this.pos.add(this.ship.vel);
    this.offSet.x = this.r * cos(this.angle) + this.ship.pos.x;
    this.offSet.y = this.r * sin(this.angle) + this.ship.pos.y;
    for (let i = 0; i < this.shots.length; i++){
      this.shots[i].enemies = this.ship.enemies;
      this.shots[i].update();
    }
    for (let i = this.shots.length - 1; i >= 0; i--){ 
      if (! this.shots[i].alive) this.shots.splice(i, 1);
    }
  }
  shoot(){
    this.shots.push(new Shot(this.offSet.x, this.offSet.y, this.angle, this.ship.enemies, this.ship.pos.x, this.ship.pos.y, this.ship.player));
  }
}