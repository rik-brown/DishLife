/* Kadenze
 * Nature of Code
 * Assignment 3: Steering Forces
 * by Richard Brown
 */

var colony; // A colony object

function setup() {
  p = new Parameters();
  gui = new dat.GUI();
  gui.remember(p);
  initGUI();
  createCanvas(windowWidth, windowHeight);
  ellipseMode(RADIUS);
  background(128);
  colony = new Colony(p.colonySize); // Populate the colony
}

function draw() {
  background(128);
  colony.run(); // Run the colony
  if (colony.cells.length === 0) {populateColony(); } // If all the cells have died, populate a new colony
}

function populateColony() {
  colony.cells = []; // Empty the arraylist (or make sure it is empty)
  colony = new Colony(p.colonySize); // Populate the colony
}

var Parameters = function () { //These are the initial values, not the randomised ones
  this.colonySize = 2; // Max number of cells in the colony
  this.colonyMaxSize = 200; // The maximum number of cells allowed in the colony
  this.cellStartSize = 20;
  this.lifespan = 1000; // How long will the cell live?
  this.fertility = 30; // When will the cell become fertile?
}

var initGUI = function () {
		var controller = gui.add(p, 'colonySize', 1, 100).step(1).name('# Cells').listen();
		  controller.onChange(function(value) {populateColony(); });
    var controller = gui.add(p, 'colonyMaxSize', 50, 500).step(10).name('Max. # Cells').listen();
  	  controller.onChange(function(value) {populateColony(); });
    var controller = gui.add(p, 'cellStartSize', 2, 200).step(1).name('Cell size').listen();
    	controller.onChange(function(value) {populateColony(); });
    var controller = gui.add(p, 'lifespan', 500, 5000).step(1).name('Cell lifespan').listen();
    	controller.onChange(function(value) {populateColony(); });
    var controller = gui.add(p, 'fertility', 0, 100).step(1).name('Cell fertility').listen();
      controller.onChange(function(value) {populateColony(); });
}
