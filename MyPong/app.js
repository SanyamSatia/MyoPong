
var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var randomstring = require("randomstring");

var routes = require('./routes/index');
var users = require('./routes/users');
var games = require('./routes/games');




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/games', games);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.get('/', function(req, res){
  res.send(__dirname + 'index.html');
});

//Define location (0, 0) to be bottom left
//direction 0 is right, direction 180 is right, direction 90 would be up

/**
 * Ball Physics goes here
 */
var ball = {
    'direction': 0, 
    'xVel': 1, 
    'yVel': 1, 
    'xPos': 1,
    'yPos': 1
}

var resetBall = function(ball) {
  ball.xPos = 1;
  ball.yPos = 1;
  ball.yVel = 1;
  ball.xVel = 1;
  ball.direction = 0;
  updateBallInfo(ball);
}

var updateBallInfo = function(ball) {
  ball.xPos = ball.xPos + (2 * ball.xVel); //change xpos by 2 pixels
  ball.yPos = ball.yPos + (2 * ball.yVel); //change ypos by 2 pixels
  io.emit('ballUpdate', ball);
  checkBounds(ball, io);
}

/**
 * Board physics goes here
 */
var lowerBound = 0;
var upperBound = 768;
var leftBound = 0;
var rightBound = 1024;
var lastToHit = null;

var checkBounds = function(ball, io) {
  if(ball.xPos < leftBound || ball.xPos > rightBound) {
    //TODO: emit ball out of bounds therefore reset
    io.emit('outOfBounds');
    resetBall(ball);
  }
  else if(ball.yPos > upperBound || ball.yPos < lowerBound) {
    ball.yVel = (ball.yVel * -1);
  }
}

//1024 * 768
//every 35 ms update the x and y coords by 1 or 2 pixels
//ball is 48 * 48 px
//Define location (0, 0) to be bottom left




var users_list = new Array(2);
var game_ready = false;
var player1_ready = false;
var player2_ready = false;

//TODO: method currently checks if game is ready
//should also start the game itself
var check_ready = function(p1, p2) {
  if(player1_ready && player2_ready) {
    io.emit('startBall', ball);
    var sendBallLocInterval = setInterval(updateBallInfo, 35);
  }
}





io.on('connection', function(socket){
  var new_user = randomstring.generate(7);
    
  //TODO: limit to 2 users max
//  if(users_list.length < 2) {
//    console.log('a user ' + '\'' + new_user + '\'' + ' connected');
//      
//    // make a random username
//    users_list.push(new_user);
//    // send the user name to the use that just logged on??
//    //TODO: send user name to client to use for identification
//    io.emit('newUser', new_user);
//    
//  }
  
  socket.on('player1Select', function(msg){
    console.log('Player 1 ready!');
    io.emit('player1Taken');
    player1_ready = true;
    user_list[0] = socket; //TODO: what do we want to save to this list??
    check_ready(player1_ready, player2_ready);
  });
    
  socket.on('player2Select', function(msg){
    console.log('Player 2 ready!');
    io.emit('player2Taken');
    player2_ready = true;
    user_list[1] = socket; //TODO: what do we really want to save to this list?
    check_ready(player1_ready, player2_ready);
  });
    
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
    
  //playerID - string that identifies the player who is ending paddle location
  socket.on('paddleLoc', function(loc, playerID){
    console.log('paddleLoc: ' + loc);
    io.emit('opponentPaddleLoc', loc + ':' + playerID); //if client player id no match, it updates enemy paddle loc
  });
    
  socket.on('hitPaddle', function(angle, playerID){
    lastToHit = playerID;
    //TODO: do reflection stuff here
    //if we hit top or bottom, xVel same, yVel opposite
      
    //if we hit left or right, yVel same, xVel opposite
    ball.xVel = (ball.xVel * -1);
    
  });
    
  
    
  // will probably require the client to send the user ID for every call
  socket.on('disconnect', function(){
    var user_index = users_list.indexOf(socket);
    users_list.pop(socket);
    if(user_index == 0) {
      new_user = 'Player 1';   
    }
    else {
      new_user = 'Player 2';   
    }
    console.log('user ' + '\'' + new_user + '\'' + ' disconnected');
    
  });
});



http.listen(8080, function(){
  console.log('listening on *:8080');
});

module.exports = app;
