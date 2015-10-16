// Build the game board
  // Get the body and append svg element to it
  // score variables
// ENEMIES
  // create an array of objects to hold enemies (x, y, r)
  // make enemies move random location every 1 second
// PLAYER
  // create a player class
    // set player's state variables
    //  a collision detection method
    // make player draggable

var w = window.innerWidth;
var h = window.innerHeight;

var svg = d3.select('body').append('svg');

svg.attr({height: h, width: w});

// instantiate enemy class
var Enemy = function(id, x, y, r) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.r = r;
};

// instantiate player class
var Player = function(x, y, r) {
  this.x = x;
  this.y = y;
  this.r = r;
};

// player method to detect collisions with enemies
Player.prototype.detectCollision = function() {

};

// create enemies array
var enemiesArray = d3.range(25).map(function(d) {
  return new Enemy(Math.floor(Math.random() * 100), Math.random() * w, Math.random() * h, 15);
});

// set enemy attributes
svg.selectAll('circle').data(enemiesArray, function(d) { return d.id; })
   .enter()
   .append('circle')
   .attr('cx', function(d){ return d.x; })
   .attr('cy', function(d) { return d.y; })
   .attr('r', function(d) { return d.r + 'px'; })
   .style('fill', 'grey')
   .classed('enemy', true);