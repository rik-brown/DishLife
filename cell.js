// cell Class
function Cell(pos, vel, cellStartSize_) {

  // BOOLEAN
  this.fertile = false; // A new cell always starts of infertile

  // GROWTH & REPRODUCTION
  this.age = 0; // Age is 'number of frames since birth'. A new cell always starts with age = 0.
  this.lifespan = random (1500, 2000);
  this.fertility = random (0.2, 0.4);
  this.spawnCount = random (2, 5);

  // SIZE AND SHAPE
  this.cellStartSize = cellStartSize_;
  this.cellEndSize = 0.5;
  this.r = this.cellStartSize; // Initial value for radius
  this.size = map(this.r, this.cellStartSize, this.cellEndSize, 1, 0);
  this.flatness = random (1.0, 1.3);
  this.growth = (this.cellStartSize-this.cellEndSize)/this.lifespan;

  // MOVEMENT
  this.position = pos; //cell has position
  this.velocity = vel; //cell has unique basic velocity component
  this.acceleration = createVector(0,0);
  this.maxspeed = 4;
  this.maxforce = 0.3;
  //this.target = createVector(mouseX,mouseY);
  this.target = createVector(width/2, height/2);


  this.run = function() {
    this.live();
    this.updatePosition();
    this.updateSize();
    this.updateFertility();
    this.checkBoundaryWraparound();
    this.display();
    if (debug) {this.cellDebugger(); }
  }

  this.live = function() {
    this.age += 1;
    this.maturity = map(this.age, 0, this.lifespan, 0, 1);
  }

  this.applyForce = function(force) {
      this.acceleration.add(force);
    }

  this.applyBehaviors = function(cells) {
    var separateForce = this.separate(cells);
    var seekForce = this.seek(this.target);

    separateForce.mult(2);
    seekForce.mult(1);

    this.applyForce(separateForce);
    this.applyForce(seekForce);
  }

// Separation
  // Method checks for nearby vehicles and steers away
  this.separate = function(cells) {
    //var desiredseparation = 20;

    var sum = createVector();
    var count = 0;
    // For every cells in the system, check if it's too close
    for (var i = 0; i < cells.length; i++) {
      var d = p5.Vector.dist(this.position, cells[i].position);
      if (this.fertile && cells[i].fertile) {desiredseparation = 0;}
      if (!this.fertile && cells[i].fertile) {desiredseparation = this.r + cells[i].r;}
      if (this.fertile && !cells[i].fertile) {desiredseparation = this.r + cells[i].r;}
      if (!this.fertile && !cells[i].fertile) {desiredseparation = (this.r + cells[i].r)*1.6;}
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



  this.updatePosition = function() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  this.updateSize = function() { //Alternatively: cell is always growing, so include this in 'living' but allow for growth=0 ??
    this.r -= this.growth; // Cell can only shrink for now
    this.size = map(this.r, this.cellStartSize, this.cellEndSize, 1, 0);
  }

  this.updateFertility = function() {
    if (this.maturity >= this.fertility) {this.fertile = true; } else {this.fertile = false; } // A cell is fertile if maturity is within limit (a % of lifespan)
    if (this.spawnCount == 0) {this.fertility = 0;} // Once spawnCount has counted down to zero, the cell will spawn no more
  }

  this.checkBoundaryWraparound = function() {
    if (this.position.x > width + this.r*this.flatness) {
      this.position.x = -this.r*this.flatness;
    } else if (this.position.x < -this.r*this.flatness) {
      this.position.x = width + this.r*this.flatness;
    } else if (this.position.y > height + this.r*this.flatness) {
      this.position.y = -this.r*this.flatness;
    } else if (this.position.y < -this.r*this.flatness) {
      this.position.y = height + this.r*this.flatness;
    }
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


  // Death
  this.dead = function() {
    if (this.size <= 0) {return true;} // Size = 0 when r = cellEndSize
    if (this.age >= this.lifespan) {return true;} // Death by old age (regardless of size, which may remain constant)
    if (this.position.x > width + this.r*this.flatness || this.position.x < -this.r*this.flatness || this.position.y > height + this.r*this.flatness || this.position.y < -this.r*this.flatness) {return true;} // Death if move beyond canvas boundary
    else {return false; }
  };


  this.display = function() {
    noStroke();
    fill(255);
    var angle = this.velocity.heading();
    push();
    translate(this.position.x, this.position.y);
    rotate(angle);
    if (this.fertile) {
      fill(255, 0, 0); ellipse(0, 0, this.r, this.r * this.flatness);
      fill(255); ellipse(0, 0, this.r * this.maturity, this.r * this.maturity * this.flatness);
      }
    else {
      fill(255); ellipse(0, 0, this.r, this.r * this.flatness);
      fill(255, 0, 0); ellipse(0, 0, this.r * this.maturity, this.r * this.maturity * this.flatness);
      }
    strokeWeight(2);
    stroke(0);
    noFill();
    ellipse(0, 0, this.r * this.fertility, this.r * this.fertility * this.flatness);
    pop();
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
    colony.spawn(this.spawnPos, this.spawnVel, this.r*random(1, 1.5));

    //Reset fertility counter
    this.fertility *= this.fertility;
    other.fertility *= other.fertility;
  }

  this.cellDebugger = function() { // Displays cell parameters as text (for debug only)
    var rowHeight = 15;
    fill(0);
    textSize(rowHeight);
    // RADIUS
    //text("r:" + this.r, this.position.x, this.position.y + rowHeight*1);
    //text("cellStartSize:" + this.cellStartSize, this.position.x, this.position.y + rowHeight*0);
    //text("cellEndSize:" + this.cellEndSize, this.position.x, this.position.y + rowHeight*3);

    // GROWTH
    text("size:" + this.size, this.position.x, this.position.y + rowHeight*2);
    //text("growth:" + this.growth, this.position.x, this.position.y + rowHeight*5);
    text("maturity:" + this.maturity, this.position.x, this.position.y + rowHeight*3);
    text("lifespan:" + this.lifespan, this.position.x, this.position.y + rowHeight*4);
    //text("age:" + this.age, this.position.x, this.position.y + rowHeight*3);
    text("fertility:" + this.fertility, this.position.x, this.position.y + rowHeight*5);
    //text("fertile:" + this.fertile, this.position.x, this.position.y + rowHeight*3);
    //text("spawnCount:" + this.spawnCount, this.position.x, this.position.y + rowHeight*4);

    // MOVEMENT
    //text("vel.x:" + this.velocity.x, this.position.x, this.position.y + rowHeight*4);
    //text("vel.y:" + this.velocity.y, this.position.x, this.position.y + rowHeight*5);
    //text("vel.heading():" + this.velocity.heading(), this.position.x, this.position.y + rowHeight*3);
  }

}
