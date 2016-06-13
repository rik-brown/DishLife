/*
 * Step 1 - a very stripped down version
 */

var colony; // A colony object
var colonySize = 2; // Number of cells in the colony
var debug = false; // Make true to activate debug functionality

function setup() {
  createCanvas(windowWidth, windowHeight);
  ellipseMode(RADIUS);
  background(128);
  colony = new Colony(colonySize); // Populate the colony
}

function draw() {
  background(128);
  colony.run(); // Run the colony
  if (colony.cells.length === 0) {populateColony(); } // If all the cells have died, populate a new colony
}

function populateColony() {
  background(0); // Refresh the background
  colony.cells = []; // Empty the arraylist (or make sure it is empty)
  colony = new Colony(colonySize); // Populate the colony
}
