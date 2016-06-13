/* Kadenze
 * Nature of Code
 * Assignment 3: Steering Forces
 * by Richard Brown
 */

var colony; // A colony object
var colonySize = 2; // Initial number of cells in the colony

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
  colony.cells = []; // Empty the arraylist (or make sure it is empty)
  colony = new Colony(colonySize); // Populate the colony
}
