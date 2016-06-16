/* Kadenze 'Nature of Code'
 * p5.js course with Daniel Shiffman
 * Assignment 3: Steering Forces
 * 'DishLife'
 * by Richard Brown
 *
 * FUTURE IDEAS:
 * #1 The colour could gradually change from blue (0,0,255) to red (255,0,0) as cell moves from infertile to fertile
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
  if (!p.displayPoint && !p.trailMode) {background(p.bkgcol);}
  if (p.trailMode) {trails();}
  colony.run(); // Run the colony
  if (colony.cells.length === 0) {populateColony(); } // If all the cells have died, populate a new colony
}

function populateColony() {
  background(p.bkgcol);
  colony.cells = []; // Empty the arraylist (or make sure it is empty)
  colony = new Colony(p.colonySize); // Populate the colony
}

function trails() {
  var transparency = 1; // 255 is fully opaque, 1 is virtually invisible
  blendMode(DIFFERENCE);
  noStroke();
  fill(1);
  rect(-1, -1, width + 1, height + 1);
  blendMode(BLEND);
  fill(255);
}

var Parameters = function () { //These are the initial values, not the randomised ones
  this.bkgcol = 128; // Background colour (greyscale)
  this.colonySize = int(random(2,20)); // Initial population of cells in the colony
  this.colonyMaxSize = 200; // The maximum number of cells allowed in the colony
  this.cellStartSize = random(50,100); // Starting cell radius
  this.lifespan = 1000; // How long will the cell live?
  this.fertility = 85; // When will the cell become fertile? (80 = when 80% of lifespan is remaining)
  this.spawnCount = 3; // How many times can the cell produce offspring?
  this.maxspeed = 4;
  this.maxforce = 0.3;
  this.sepFF = 0; // Separation for Fertile && Fertile
  this.sepFI = 100; // Separation for Fertile && Infertile
  this.sepII = 200; // Separation for Infertile && Infertile

  this.seekWeight = 0.5; // Multiplier for 'seek target' behaviour
  this.separateWeight = 2; // Multiplier for 'separate' behaviour
  this.growthFactor = 1.3; // If >1 then spawned cell will be larger than parents r at conception
  this.displayMode = 1; // 1=ellipse, 2=point, 3=text
  this.trailMode = false; // Toggle to display trails
  this.moveTarget = false; // Toggle between 'center' and cell[0].position
}

var initGUI = function () {
		var controller = gui.add(p, 'colonySize', 1, 100).step(1).name('#Cells (start)').listen();
		  controller.onChange(function(value) {populateColony(); });
    var controller = gui.add(p, 'colonyMaxSize', 50, 500).step(10).name('#Cells (Max.)').listen();
  	  controller.onChange(function(value) {populateColony(); });
    var controller = gui.add(p, 'cellStartSize', 2, 200).step(1).name('Size').listen();
    	controller.onChange(function(value) {populateColony(); });
    var controller = gui.add(p, 'lifespan', 500, 5000).step(1).name('Lifespan').listen();
    	controller.onChange(function(value) {populateColony(); });
    var controller = gui.add(p, 'fertility', 0, 100).step(1).name('Fertility').listen();
      controller.onChange(function(value) {populateColony(); });
    var controller = gui.add(p, 'spawnCount', 0, 10).step(1).name('#Children').listen();
      controller.onChange(function(value) {populateColony(); });
    var controller = gui.add(p, 'growthFactor', 1, 2).name('Growth Factor').listen();
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
    var controller = gui.add(p, 'displayMode', { Ellipse: 1, Point: 2, Text: 3 } ); // COMPLETE THIS!
      controller.onChange(function(value) {populateColony(); });
    gui.add(p, 'trailMode').name('Trails');
    gui.add(p, 'moveTarget').name('Follow #0');
}
