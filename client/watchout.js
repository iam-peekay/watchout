// PLANNING: 
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




// setting up environment variables
var w = 1020;
var h = 760;
var svg = d3.select('.board').append('svg');
var collisions = 0;
svg.attr({height: h, width: w});

// setting up socket io
var socket = io();

// instantiate enemy class
var Enemy = function(id, x, y, r) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.r = r;
  this.isColliding = false ;
};

// function to keep enemies in the bounds of the window
Enemy.prototype.checkBounds = function(){
  if(this.x >= w - this.r || this.x  <= this.r || this.y >= h - this.r || this.y <= this.r){
    return true;
  } else {
    return false;
  }
}


// instantiate player class
var Player = function(id, x, y, r, score) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.r = r;
  this.score = score;
  this.highscore = 0 ;
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
    if(sqrRoot < radiusSum && !enemy.isColliding){
      enemy.isColliding = true;
      collisionExists = true;
    } else if (sqrRoot >= radiusSum && enemy.isColliding){
      enemy.isColliding =false;
    }
  });
    return collisionExists;
};

// create enemies array
var enemiesArray = d3.range(30).map(function(d) {
  return new Enemy(Math.floor(Math.random() * 100), Math.floor(Math.random() * w), Math.floor(Math.random() * h), 15);

});

// create players array
var player = d3.range(2).map(function(d , i) {
  return new Player('player' + i, w / 2, h / 2, 20, 0);
});

// set enemy attributes
var enemies = svg.selectAll('.enemy').data(enemiesArray, function(d) { return d.id; })
  .enter()
  .append("image")
  .attr("xlink:href", "asteroid.png")
  .attr("x", function(d){ return d.x + "px"; })
  .attr("y", function(d) { return d.y + "px"; })
  .attr("width", "24px")
  .attr("height", "24px")
  .classed('enemy', true);

// set player attributes
var svgPlayer = svg.selectAll('.player').data(player, function(d, i) { return d.id; })
   .enter()
   .append('circle')
   .attr('cx', function(d){ return d.x; })
   .attr('cy', function(d) { return d.y; })
   .attr('r', function(d) { return d.r + 'px'; })
   .style('fill', '#EF233C')
   .attr('class', function (d){ return d.id});

// functionality for the player to drag
var drag = d3.behavior.drag();
  drag.on("drag", function(d){
  d.x += d3.event.dx;
  d.y += d3.event.dy;

  socket.emit('playermove', {x : d.x , y : d.y , id: d.id});
  // 
  d3.select(this).attr('cx', function(d){ return d.x; })
        .attr('cy', function(d) { return d.y; })
});

svgPlayer.call(drag);

// socket ip listener to sync players
socket.on("playermove", function(move){
  d3.select('.' + move.id).attr('cx', function(){ 
    return move.x;
     })
    .attr('cy', function() {
     return move.y;
    });
});


// map the enemies array created on the client side for the server to use
var enemyForServer = enemiesArray.map(function(enemy) {
  return {x: enemy.x, y: enemy.y};
});

// emit enemies array to the server
socket.emit('enemiesArr', enemyForServer);

// listen to the mapped and updated positions of enemies from the server, and re-render
socket.on('enemiesArr', function(enemyArray) {

  enemies.transition().duration(1200)
  .attr('x', function(d, i){
    d.x = enemyArray[i].x ;
    if(d.checkBounds()){
      d.x = w/2;
    }
    return d.x + "px";
  })
  .attr('y', function(d, i){
    d.y = enemyArray[i].y ;
    if(d.checkBounds()){
      d.y = h/2;
    }
    return d.y + "px";
  })
});


// updates player score
setInterval(function(){
  player[0].score += 1;
  if(player[0].detectCollision()){
    collisions++;

    socket.emit('death', { reset : true})

    player[0].score = 0;
  }
  d3.select('.current').text("Current score: " + player[0].score);
  d3.select('.collides').text("Current collisions: " + collisions );
  if(player[0].score > player[0].highscore){
    player[0].highscore = player[0].score;
    d3.select('.highscore').text("High score: " + player[0].highscore);
  }

}, 200);


// resets game when new player enters
var resetgame = function(){

  player[0].score = 0;
  player[0].highscore = 0;
  collisions = 0;

  d3.select('.current').text("Current score: " + player[0].score);
  d3.select('.collides').text("Current collisions: " + collisions );
  d3.select('.highscore').text("High score: " + player[0].highscore);
  player[1].score = 0;
  player[1].highscore = 0;
  collisions = 0;

  d3.select('.current2').text("Current score: " + player[1].score);
  d3.select('.collides2').text("Current collisions: " + collisions );
  d3.select('.highscore2').text("High score: " + player[1].highscore);

};

// second score board to add if second player joins
var addScoreboard = function() {
  d3.select('.current2').text("Current score: " + player[1].score);
  d3.select('.collides2').text("Current collisions: " + collisions );
  d3.select('.highscore2').text("High score: " + player[1].highscore);
};

// if a 2nd player connects, reset the score
socket.on("playerConnect", function(count){
  if(count > 1){
    addScoreboard();
    resetgame();
  }
});

// if a collision, reset game
socket.on("death", resetgame );







