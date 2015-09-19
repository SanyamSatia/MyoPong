var playerSide = "right";
var oppSide = "left";
var myname = null;
var inside = true;

$( document ).ready(function() {
	$("#"+playerSide).mousemove(function(e){
		$("#playerPaddle").css({left:e.pageX, top:e.pageY});
	});
});

var socket = io();

function sendPaddleLoc(){
    socket.emit('paddleLoc',$("#playerPaddle").offset());
}

socket.on('ballLoc', function(loc){
	$("#ball").offset(loc);
});

socket.on('opponentPaddleLoc', function(loc) {
	$("#opponentPaddleLoc").offset(loc);
});

socket.on('newUser', function(username) {
    console.log(username); 
    if(myname == null) {
        myname = username;
    }
});

var intervalID = setInterval(sendPaddleLoc, 100);