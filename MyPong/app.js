
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

var users_list = new Array(2);


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

io.on('connection', function(socket){
  var new_user = randomstring.generate(7);
    
  //TODO: limit to 2 users max
  if(users_list.length < 2) {
    console.log('a user ' + '\'' + new_user + '\'' + ' connected');
      
    // make a random username
    users_list.push(new_user);
    // send the user name to the use that just logged on??
    //TODO: send user name to client to use for identification
    io.emit('newUser', new_user);
    
    
  }
  
  
    
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
    
  socket.on('paddleLoc', function(msg){
    console.log('paddleLoc: ' + msg);
    io.emit('opponentPaddleLoc', msg);
  });
    
  // will probably require the client to send the user ID for every call
  socket.on('disconnect', function(){
    var old_user = users_list.pop(new_user);
    console.log('user ' + '\'' + new_user + '\'' + ' disconnected');
    
  });
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});

module.exports = app;
