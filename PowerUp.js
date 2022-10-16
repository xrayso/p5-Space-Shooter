class PowerUp{
  constructor(x, y){
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.r = 8;
    this.value = random(5);
  }
  show(){
    noStroke();
    fill(255, 0, 0);
    circle(this.pos.x, this.pos.y, this.r);
  }
  update(){
    this.pos.add(this.vel);
    if (this.pos.x > width){
      this.pos.x = 0;
    }
    if (this.pos.x < 0){
      this.pos.x = width;
    }
    if (this.pos.y > height){
      this.pos.y = 0;
    }
    if (this.pos.y < 0){
      this.pos.y = height;
    }
  }
}