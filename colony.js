// Colony class

// CONSTRUCTOR: Create a 'Colony' object, initially populated with 'num' cells
function Colony(numCells) { // Imports 'num' from Setup in main, the number of Cells in initial spawn
  // Start with an empty array for all cells
  this.cells = [];

  var colonyMaxSize = 200; // The maximum number of cells allowed in the colony

  // Create initial population of cells
  for (var i = 0; i < numCells; i++) {
    var pos = createVector(random(width), random(height)); // Cells have random position
    var vel = createVector(0,0); // Initial velocity vector is 0
    var cellStartSize = random (30, 50);
    this.cells.push(new Cell(pos, vel, cellStartSize)); // Add new Cell
  }

    // Run the colony
  this.run = function() {
    //var target = createVector(mouseX, mouseY);
    var target = createVector(width/2, height/2);

    if (debug) {this.colonyDebugger(); }

    // Iterate backwards through the ArrayList because we are removing items
    for (var i = this.cells.length - 1; i >= 0; i--) {

      var c = this.cells[i]; // Get one cell at a time
      c.seek(target);
      c.applyBehaviors(this.cells);
      c.run(); // Run it (grow, move, spawn, check position vs boundaries etc.)
      if (c.dead()) {this.cells.splice(i, 1);} // If cell has died, remove it from the array

      // Iteration to check collision between current cell(i) and the rest
      if (this.cells.length <= colonyMaxSize) { // Don't check for collisons if there are too many cells (wait until some die off)
        if (c.fertile) { //Only do the check on cells that are fertile
          for (var others = i - 1; others >= 0; others--) { // Since main iteration (i) goes backwards, this one needs to too
            var other = this.cells[others]; // Get the other cells, one by one
            if (other.fertile) {c.checkCollision(other);} // Only check for collisions when both cells are fertile
          }
        }
      }

    }

    // If there are too many cells, remove some by 'culling' (not actually active now, functional code is commented out)
    if (this.cells.length > colonyMaxSize) {
      this.cull(colonyMaxSize);
    }
  }


  this.spawn = function(pos_, vel_, cellStartSize_) { // Spawn a new cell
    this.cells.push(new Cell(pos_, vel_, cellStartSize_));
  }

  this.cull = function(div) { // To remove a proportion of the cells from (the oldest part of) the colony
    var cull = (this.cells.length / div);
    for (var i = cull; i >= 0; i--) { this.cells.splice(i,1); }
    //background(0);                    // Use this to clear the background on cull
    //fill(255, 1);                     // Use this to veil the background on cull
    //rect(-1, -1, width+1, height+1);
  }

  this.colonyDebugger = function() { // Displays some values as text at the top left corner (for debug only)
    fill(0);
    rect(0,0,300,20);
    fill(360, 100);
    textSize(16);
    text("Nr. cells: " + this.cells.length + " MaxLimit:" + colonyMaxSize, 10, 20);
  }


}
