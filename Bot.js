class Bot{
  static dodge(ship){
    for (var enemy of ship.enemies){
      for (var canon of enemy.canons){
        for (var shot of canon.shots){
          let target = shot.pos.copy();
          target.add(p5.Vector.mult(shot.vel, 30));
          let force = p5.Vector.sub(target, ship.pos);
          force.mult(-1);
          let maxDist = Math.sqrt(width*width + height*height)
          force.setMag(map(shot.pos.dist(ship.pos), 0, maxDist, 5, 0));
          ship.acc.add(force);
          return;
        }
      }
    }
    ship.vel.mult(1);
  }
  static aim(ship){
    let target = ship.enemies[0];
    let targetVel = p5.Vector.sub(target.pos, ship.pos);
    if (targetVel.heading() > ship.angle - PI/2){
      ship.turn(0.02);
    }else if (targetVel.heading() < ship.angle + PI/2){
      ship.turn(-0.02);
    }
  }
}