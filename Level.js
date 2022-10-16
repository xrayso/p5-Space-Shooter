class Level{
  constructor(difficulty, targets){
    this.ships = [];
    this.difficulty = difficulty;
    this.targets = targets;
    this.reset = false;
    if (this.difficulty % 5 == 0){
      this.ships.push(Ship.randomBoss(this.difficulty));
      return;
    }
    for (let i = 0; i < ceil(difficulty/2); i++){
      let x = random(30, width-30);
      let y = random(30, height-30);
      while (dist(x, y, ship.pos.x, ship.pos.y) <= width/4){
        x = random(30, width-30);
        y = random(30, height-30);
      }
      let newShip = Ship.randomShip(x, y, this.targets, this.difficulty);
      newShip.aim = this.difficulty % 3 == 0;
      newShip.dodge = this.difficulty % 2 == 0;
      this.ships.push(newShip);
    }
  }
  run(){
    for (let i = this.ships.length-1; i >= 0; i--){
      if (this.ships[i].health <= 0){ 
        this.ships.splice(i, 1);
      }
    }
    for (let i = 0; i < this.ships.length; i++){
      this.ships[i].enemies = this.targets;
      if (this.ships[i].dodge){
        Bot.dodge(this.ships[i]);
      }
      if (this.ships[i].aim){
        Bot.aim(this.ships[i]);
      }else{
        this.ships[i].turn(0.05);
      }
      this.ships[i].enemies = this.targets;
      this.ships[i].update();
      this.ships[i].show('red');
    }
    for (let i = 0; i < this.ships.length; i++){
      if (frameCount % this.ships[i].fireRate == 0){
        this.ships[i].shoot();
      }
    }

    if (this.ships.length == 0){
      this.reset = true;
    }
  }
}