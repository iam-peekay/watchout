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

var svg = d3.select('.board').append('svg');

svg.attr({height: h, width: w});

// instantiate enemy class
var Enemy = function(id, x, y, r) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.r = r;
};

Enemy.prototype.checkBounds = function(){
  if(this.x >= w - this.r || this.x  <= this.r || this.y >= h - this.r || this.y <= this.r){
    return true;
  } else {
    return false;
  }
}


// instantiate player class
var Player = function(id, x, y, r) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.r = r;
};

// player method to detect collisions with enemies
Player.prototype.detectCollision = function() {

  var collisionExists = false;
  var that = this;
  enemiesArray.forEach(function(enemy, index){
    var xDiff = enemy.x - that.x;
    var yDiff = enemy.y - that.y;
    var radiusSum = that.r + enemy.r;
    var sqrRoot = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    if(sqrRoot < radiusSum){
      collisionExists = true;
    }
  });
    return collisionExists;
};

// create enemies array
var enemiesArray = d3.range(25).map(function(d) {
  return new Enemy(Math.floor(Math.random() * 100), Math.floor(Math.random() * w), Math.floor(Math.random() * h), 15);

});

// create a player
var player = d3.range(1).map(function(d) {
  return new Player('player1', w / 2, h / 2, 20);
});

// set enemy attributes
var enemies = svg.selectAll('.enemy').data(enemiesArray, function(d) { return d.id; })
   .enter()
   .append('circle')
   .attr('cx', function(d){ return d.x; })
   .attr('cy', function(d) { return d.y; })
   .attr('r', function(d) { return d.r + 'px'; })
   .style('fill', 'grey')



// set player attributes
var svgPlayer = svg.selectAll('.player').data(player, function(d) { return d.id; })
   .enter()
   .append('circle')
   .attr('cx', function(d){ return d.x; })
   .attr('cy', function(d) { return d.y; })
   .attr('r', function(d) { return d.r + 'px'; })
   .style('fill', 'red')
   .classed('player', true);

var drag = d3.behavior.drag();
  drag.on("drag", function(d){
  d.x += d3.event.dx;
  d.y += d3.event.dy;
  d3.select(this).attr('cx', function(d){ return d.x; })
        .attr('cy', function(d) { return d.y; })
});

svgPlayer.call(drag);


setInterval(function() {

  enemies.transition().duration(1200)
  .attr('cx', function(d){
    d.x =  w * Math.random() ;
    if(d.checkBounds()){
      d.x = w/2;
    }
    return d.x;
  })
  .attr('cy', function(d){
    d.y = Math.random() * h ;
    if(d.checkBounds()){
      d.y = h/2;
    }
    return d.y;
  })

},1200)

setInterval(function(){
  if(player[0].detectCollision()){
    console.log("hello");
  }
}, 100);








