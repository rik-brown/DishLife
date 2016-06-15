/* Kadenze
 * Nature of Code
 * Assignment 3: Steering Forces
 * by Richard Brown
 *
 * WISHLIST:
 * #1 It would be fun to see colour changing from blue (0,0,255) to red (255,0,0) as cell moves from infertile to fertile
 * #3 The spacing ought to reflect some feature of the cell: radius, maturity, fertility etc. Maybe small cells should be further apart?
 * #4 The weighting between 'seek center' and 'separate' ought to be configurable
 * #5 The movement is kinda jerky
 * #6 Some 'veiled trails' might be nice to look at
 * #7 Points ought to be improved or removed (relates to #5)
 * #8 Maybe the target should move? Could it be one of the cells? cells[0]? (this would change as the numbers are reshuffled upon deaths)
 * #9 Idea: Instead of ellipse, render the cells as a Number (i) Or a text : "Foe" (infertile) & "Friend" (fertile)
 */

var colony; // A colony object

function setup() {
  //frameRate(10);
  p = new Parameters();
  gui = new dat.GUI();
  gui.remember(p);
  initGUI();
  createCanvas(windowWidth, windowHeight);
  ellipseMode(RADIUS);
  background(p.bkgcol);
  colony = new Colony(p.colonySize); // Populate the colony
}

function draw() {
  if (!p.displayPoint) {background(p.bkgcol);}
  colony.run(); // Run the colony
  if (colony.cells.length === 0) {populateColony(); } // If all the cells have died, populate a new colony
}

function populateColony() {
  background(p.bkgcol);
  colony.cells = []; // Empty the arraylist (or make sure it is empty)
  colony = new Colony(p.colonySize); // Populate the colony
}

var Parameters = function () { //These are the initial values, not the randomised ones
  this.colonySize = int(random(2,10)); // Max number of cells in the colony
  this.colonyMaxSize = 200; // The maximum number of cells allowed in the colony
  this.cellStartSize = 80; // Starting radius
  this.lifespan = 1000; // How long will the cell live?
  this.fertility = 80; // When will the cell become fertile?
  this.spawnCount = 2; // How many times can the cell produce offspring?
  this.maxspeed = 4;
  this.maxforce = 0.3;
  this.sepFF = 0; // Separation for Fertile && Fertile
  this.sepFI = 100; // Separation for Fertile && Infertile
  this.sepII = 200; // Separation for Infertile && Infertile
  this.displayPoint = false; // Toggle to display cell as 'point' instead of an ellipse
  this.bkgcol = 128; // Background colour (greyscale)
  this.seekWeight = 0.5; // Multiplier for 'seek target' behaviour
  this.separateWeight = 2; // Multiplier for 'separate' behaviour
  this.growthFactor = 1.1; // If >1 then spawned cell will be larger than parents
}

var initGUI = function () {
		var controller = gui.add(p, 'colonySize', 1, 100).step(1).name('# Cells').listen();
		  controller.onChange(function(value) {populateColony(); });
    var controller = gui.add(p, 'colonyMaxSize', 50, 500).step(10).name('Max. # Cells').listen();
  	  controller.onChange(function(value) {populateColony(); });
    var controller = gui.add(p, 'cellStartSize', 2, 200).step(1).name('Start size').listen();
    	controller.onChange(function(value) {populateColony(); });
    var controller = gui.add(p, 'lifespan', 500, 5000).step(1).name('Lifespan').listen();
    	controller.onChange(function(value) {populateColony(); });
    var controller = gui.add(p, 'fertility', 0, 100).step(1).name('Fertility').listen();
      controller.onChange(function(value) {populateColony(); });
    var controller = gui.add(p, 'spawnCount', 0, 10).step(1).name('Max. # Children').listen();
      controller.onChange(function(value) {populateColony(); });
    var controller = gui.add(p, 'growthFactor', 1, 2).step(1).name('Growth Factor').listen();
      controller.onChange(function(value) {populateColony(); });
    var controller = gui.add(p, 'maxspeed', 1, 10).step(1).name('Max. Speed').listen();
      controller.onChange(function(value) {populateColony(); });
    var controller = gui.add(p, 'maxforce', 0.1, 1.0).name('Max. Force').listen();
      controller.onChange(function(value) {populateColony(); });
    var controller = gui.add(p, 'sepFF', 0, 50).name('Sep. RedRed').listen();
      controller.onChange(function(value) {populateColony(); });
    var controller = gui.add(p, 'sepFI', 0, 500).name('Sep. RedWhite').listen();
      controller.onChange(function(value) {populateColony(); });
    var controller = gui.add(p, 'sepII', 0, 500).name('Sep. WhiteWhite').listen();
      controller.onChange(function(value) {populateColony(); });
    var controller = gui.add(p, 'seekWeight', 0, 5).name('Seek Strength').listen();
      controller.onChange(function(value) {populateColony(); });
    var controller = gui.add(p, 'separateWeight', 0, 5).name('Sep. Strength').listen();
      controller.onChange(function(value) {populateColony(); });
    var controller = gui.add(p, 'displayPoint').name('Point').listen();
      controller.onChange(function(value) {populateColony(); });
}
