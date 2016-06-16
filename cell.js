// cell Class
function Cell(pos, vel, cellStartSize_) {

  // BOOLEAN
  this.fertile = false; // A new cell always starts of infertile

  // GROWTH & REPRODUCTION
  this.age = 0; // Age is 'number of frames since birth'. A new cell always starts with age = 0.
  this.lifespan = p.lifespan * random (0.8, 1.2);
  this.fertility = p.fertility * 0.01 * random (0.8, 1.0); // Fertility is a number between 0 and 1
  this.spawnCount = p.spawnCount; // How many times can the cell produce offspring?

  // SIZE AND SHAPE
  this.cellStartSize = cellStartSize_;
  this.cellEndSize = 0.5;
  this.r = this.cellStartSize; // Initial value for radius
  this.size = map(this.r, this.cellStartSize, this.cellEndSize, 1, 0); // Size is a measure of progress from starting to final radius
  this.flatness = random (0.6, 1.4); // Flatness makes the circle into an ellipse
  this.growth = (this.cellStartSize-this.cellEndSize)/this.lifespan; // Growth-rate is calculated from size & expected lifespan

  // MOVEMENT
  this.position = pos; //cell has position
  this.velocity = vel; //cell has velocity
  this.acceleration = createVector(0,0); // acceleration starts at zero
  this.maxspeed = p.maxspeed;
  this.maxforce = p.maxforce;
  //this.target = createVector(mouseX,mouseY); // colony moves towards the mouse
  this.target = createVector(width/2, height/2); // colony moves towards the center of the canvas

  this.run = function(i) {
    if (p.moveTarget) {this.updateMovingTarget();}
    this.live();  // Cell lives
    this.updatePosition(); // Cell moves
    this.updateSize(); // Cell grows
    this.updateFertility(); // Cell matures
  }

  this.updateMovingTarget = function() {
    this.movingTargetX = colony.cells[0].position.x;
    this.movingTargetY = colony.cells[0].position.y;
    this.movingTarget = createVector(this.movingTargetX, this.movingTargetY); // The target is always 'cell[0]'
  }

  this.live = function() {
    this.age += 1; // Age starts at 0 and increases by one for every drawcycle
    this.maturity = map(this.age, 0, this.lifespan, 1, 0); // Maturity moves from 1 at spawn to 0 at death
  }

  this.updatePosition = function() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  this.updateSize = function() {
    this.r -= this.growth;
    this.size = map(this.r, this.cellStartSize, this.cellEndSize, 1, 0);
  }

  this.updateFertility = function() {
    if (this.maturity <= this.fertility) {this.fertile = true; } else {this.fertile = false; } // A cell is fertile if maturity is above fertility threhold
    if (this.spawnCount == 0) {this.fertility = 0;} // Once spawnCount has counted down to zero, the cell will spawn no more
  }

  this.seek = function(target) {
    var desired = p5.Vector.sub(target, this.position);

    // Normalize desired and scale to maximum speed
    desired.normalize();
    desired.mult(this.maxspeed);

    // Steering formula
    var steering = p5.Vector.sub(desired, this.velocity);
    steering.limit(this.maxforce);
    return(steering);
  }


  this.applyForce = function(force) {
    this.acceleration.add(force);
  }

  this.applyBehaviors = function(cells) {
    var separateForce = this.separate(cells);
    if (!p.moveTarget) {var seekForce = this.seek(this.target);}  else {var seekForce = this.seek(this.movingTarget);}

    separateForce.mult(p.separateWeight);
    seekForce.mult(p.seekWeight);

    this.applyForce(separateForce);
    this.applyForce(seekForce);
  }

// Separation
  // Method checks for nearby vehicles and steers away
  this.separate = function(cells) {
    var sum = createVector();
    var count = 0;
    // For every cell in the system, check if it's too close
    for (var i = 0; i < cells.length; i++) {
      var d = p5.Vector.dist(this.position, cells[i].position);
      // if (this.fertile && cells[i].fertile) {desiredseparation = 0;}
      // if (!this.fertile && cells[i].fertile || this.fertile && !cells[i].fertile) {desiredseparation = this.r + cells[i].r;}
      // if (!this.fertile && !cells[i].fertile) {desiredseparation = (this.r + cells[i].r)*1.6;}
      if (this.fertile && cells[i].fertile) {desiredseparation = p.sepFF * 0.01 * (this.r + cells[i].r);}
      if (!this.fertile && cells[i].fertile || this.fertile && !cells[i].fertile) {desiredseparation = p.sepFI * 0.01 * (this.r + cells[i].r);}
      if (!this.fertile && !cells[i].fertile) {desiredseparation = p.sepII * 0.01 * (this.r + cells[i].r);}
      // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
      if ((d > 0) && (d < desiredseparation)) {
        // Calculate vector pointing away from neighbor
        var diff = p5.Vector.sub(this.position, cells[i].position);
        diff.normalize();
        diff.div(d);        // Weight by distance
        sum.add(diff);
        count++;            // Keep track of how many
      }
    }
    // Average -- divide by how many
    if (count > 0) {
      sum.div(count);
      // Our desired vector is the average scaled to maximum speed
      sum.normalize();
      sum.mult(this.maxspeed);
      // Implement Reynolds: Steering = Desired - Velocity
      sum.sub(this.velocity);
      sum.limit(this.maxforce);
    }
    return sum;
  }

  // Death
  this.dead = function() {
    if (this.size <= 0) {return true;} // Size = 0 when r = cellEndSize
    if (this.age >= this.lifespan) {return true;} // Death by old age (regardless of size, which may remain constant)
    // Death if move beyond canvas boundary:
    if (this.position.x > width + this.r*this.flatness || this.position.x < -this.r*this.flatness || this.position.y > height + this.r*this.flatness || this.position.y < -this.r*this.flatness) {return true;}
    else {return false; }
  };

  // Display the cell using ellipse
  this.displayEllipse = function() {
    noStroke();
    fill(255);
    var angle = this.velocity.heading();
    push();
    translate(this.position.x, this.position.y);
    rotate(angle);
    if (this.fertile) {
      fill(255, 0, 0); ellipse(0, 0, this.r, this.r * this.flatness); // Red ellipse at full size of cell
      fill(255); ellipse(0, 0, this.r * (1-this.maturity), this.r * (1-this.maturity) * this.flatness); // White ellipse which grows from center
      }
    else {
      fill(255); ellipse(0, 0, this.r, this.r * this.flatness); // White ellipse at full size of cell
      fill(255, 0, 0); ellipse(0, 0, this.r * (1-this.maturity), this.r * (1-this.maturity) * this.flatness); // Red ellipse which grows from center
      }
    if (this.spawnCount >0) {
      strokeWeight(1);
      stroke(p.bkgcol);
      noFill();
      ellipse(0, 0, this.r * (1-this.fertility), this.r * (1-this.fertility) * this.flatness); // Fixed ellipse indicating 'fertility threshold'
    }
    pop();
  }

  // Display the cell using a colourshifting ellipse (blue = cold, red = warm)
  this.displayEllipseHotCold = function() {
    noStroke();
    var angle = this.velocity.heading();
    var blue = map(this.maturity, 1, this.fertility, 255, 0);
    var ripeness = map(this.maturity, 1, this.fertility, 0, this.r);
    var red = 255 - blue;
    push();
    translate(this.position.x, this.position.y);
    rotate(angle);
    fill(red, 0, blue); ellipse(0, 0, this.r, this.r * this.flatness); // Red ellipse at full size of cell
    // if (this.spawnCount >0) {
    //   strokeWeight(1);
    //   stroke(255);
    //   noFill();
    //   ellipse(0, 0, ripeness, ripeness * this.flatness); // Fixed ellipse indicating 'fertility threshold'
    // }
    pop();
  }


  // Display the cell using points
  this.displayPoint = function() {
    noFill();
    strokeWeight(5);
    if (this.fertile) {stroke(255, 0, 0, 128);} else {stroke(255, 128);}
    point(this.position.x, this.position.y);
  }

  // Display the cell using text
  this.displayText = function(i) {
    noStroke();
    textSize(this.r);
    if (this.fertile) {fill(255, 0, 0); text("Friend#" + i, this.position.x, this.position.y);} else {fill(255); text("Foe#" + i, this.position.x, this.position.y);}
  }

  this.checkCollision = function(other) { // Method receives a Cell object 'other' to get the required info about the collidee
    var distVect = p5.Vector.sub(other.position, this.position); // Static vector to get distance between the cell & other
    var distMag = distVect.mag(); // calculate magnitude of the vector separating the balls
    if (distMag < (this.r + other.r)) {this.conception(other, distVect);} // Spawn a new cell
  }

  this.conception = function(other, distVect) {
    // Decrease spawn counters.
    this.spawnCount--;
    other.spawnCount--;

    // Calculate position for spawn based on PVector between cell & other (leaving 'distVect' unchanged, as it is needed later)
    this.spawnPos = distVect.copy(); // Create spawnPos as a copy of the (already available) distVect which points from parent cell to other
    this.spawnPos.normalize();
    this.spawnPos.mult(this.r); // The spawn position is located at parent cell's radius
    this.spawnPos.add(this.position);

    // Calculate velocity vector for spawn as being centered between parent cell & other
    this.spawnVel = this.velocity.copy(); // Create spawnVel as a copy of parent cell's velocity vector
    this.spawnVel.add(other.velocity); // Add dad's velocity
    this.spawnVel.normalize(); // Normalize to leave just the direction and magnitude of 1 (will be multiplied later)

    // Call spawn method (in Colony) with the new parameters for position, velocity, colour & starting radius)
    colony.spawn(this.spawnPos, this.spawnVel, this.r*p.growthFactor);

    //Reset fertility counter
    this.fertility *= this.fertility;
    other.fertility *= other.fertility;
  }

}
