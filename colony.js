// Colony class

// CONSTRUCTOR: Create a 'Colony' object, initially populated with 'numCells' cells
function Colony(numCells) {
  // Start with an empty array for all cells
  this.cells = [];

  // Create initial population of cells
  for (var i = 0; i < numCells; i++) {
    var pos = createVector(random(width), random(height)); // Cells have random position
    var vel = createVector(0,0); // Initial velocity vector is 0
    var cellStartSize = p.cellStartSize * random (0.8, 1.2); // Initial size varies somewhat
    this.cells.push(new Cell(pos, vel, cellStartSize)); // Add new Cell to the array
  }

  // Called to spawn a new cell
  this.spawn = function(pos_, vel_, cellStartSize_) {
    this.cells.push(new Cell(pos_, vel_, cellStartSize_));
  }


  // Run the colony
  this.run = function() {

    // Iterate backwards through the ArrayList because we are removing items
    for (var i = this.cells.length - 1; i >= 0; i--) {

      var c = this.cells[i]; // Get one cell at a time
      c.run(); // Run it (grow, move, spawn, check position vs boundaries etc.)
      c.applyBehaviors(this.cells);
      if (c.dead()) {this.cells.splice(i, 1);} // If cell has died, remove it from the array
      if (p.displayMode == 1) {c.displayEllipse();}
      if (p.displayMode == 2) {c.displayPoint();}
      if (p.displayMode == 3) {c.displayText(i);}
      if (p.displayMode == 4) {c.displayEllipseHotCold();}

      // Iteration to check collision between current cell(i) and the rest
      if (this.cells.length <= p.colonyMaxSize) { // Don't check for collisons if there are too many cells (wait until some die off)
        if (c.fertile) { //Only do the check on cells that are fertile
          for (var others = i - 1; others >= 0; others--) { // Since main iteration (i) goes backwards, this one needs to too
            var other = this.cells[others]; // Get the other cells, one by one
            if (other.fertile) {c.checkCollision(other);} // Only check for collisions when both cells are fertile
          }
        }
      }
    }

    // If there are too many cells, remove some by 'culling'
    if (this.cells.length > p.colonyMaxSize) {
      this.cull(p.colonyMaxSize);
    }
  }

  // To remove a proportion of the cells from (the oldest part of) the colony
  this.cull = function(div) {
    var cull = (this.cells.length / div);
    for (var i = cull; i >= 0; i--) { this.cells.splice(i,1); }
  }
}
