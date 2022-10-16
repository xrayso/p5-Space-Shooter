class Shot{
  constructor(x, y, angle, enemies, shipX, shipY, player){
    this.pos = createVector(x, y);
    this.vel = p5.Vector.fromAngle(angle - 1.5708, 1).setMag(5);
    this.alive = true;
    this.enemies = enemies;
    this.shipPos = createVector(shipX, shipY);
    this.player = player;
    
  }
  show(){
    if (! this.player){
      stroke(0, 255, 0);
    }else{
      stroke(0, 255, 255)
    }
    strokeWeight(3);
    push();
    translate(this.shipPos.x, this.shipPos.y);
    const xPos = this.pos.x - this.shipPos.x;
    const yPos = this.pos.y - this.shipPos.y; 
    // console.log(yPos)
    line(xPos, yPos, xPos-this.vel.x*3, yPos - this.vel.y*3);
    pop();
  }
  update(){
    this.pos.add(this.vel);
    this.collision()
    if (this.pos.y < 0 || this.pos.x < 0 || this.pos.x > width || this.pos.y > height){
      this.alive = false;
    }
  }
  collision(){
    let enemyHit;
    let closestY = -Infinity;
    for (var enemy of this.enemies){
      if (this.pos.x <= enemy.pos.x+enemy.length/2 && this.pos.x >= enemy.pos.x-enemy.length/2){
        if (this.pos.y <= enemy.pos.y+enemy.width/2 && this.pos.y >= enemy.pos.y-enemy.width/2){
          if (abs(this.pos.y - enemy.pos.y)< abs(this.pos.y - closestY)){
            closestY = enemy.pos.y;
            enemyHit = enemy;
          }
        }
      }
    }
    if (enemyHit){
      enemyHit.health--;
      this.alive = false;
    }
  }
}