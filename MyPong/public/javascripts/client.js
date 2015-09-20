
var myname = null;

var playerSide, oppSide;
var hitBool = false;
var updateHitBoolInterval;
playerNumber = document.cookie;

if(playerNumber == "1") {
	playerSide = "left";
	oppSide = "right";
}
else {
	playerSide = "right";
	oppSide = "left";
}

$( document ).ready(function() {
	$("#"+playerSide).mousemove(function(e){
		$("#" + playerSide + "Paddle").css({left:e.pageX, top:e.pageY});
	});
	$("#ball").mousemove(function(e){
		$("#" + playerSide + "Paddle").css({left:e.pageX, top:e.pageY});
	});
	$("#ball").css({left:200,top:200});
});

var socket = io();

function sendPaddleLoc() {
    socket.emit('paddleLoc',{id: playerNumber, paddleLoc: $("#" + playerSide + "Paddle").offset()});
}

function checkHit() {
	var balltl = $("#ball").offset();
	var ballbr = { top: balltl.top + $("#ball").height(), left: balltl.left + $("#ball").width()};
	var ballbl = { top: ballbr.top, left:balltl.left};
	var balltr = { top: balltl.top, left: ballbr.left};
	var paddletl = $("#" + playerSide + "Paddle").offset();
	var paddlebr = { top: paddletl.top + $("#" + playerSide + "Paddle").height(), left: paddletl.left + $("#" + playerSide + "Paddle").width()};
	var paddlebl = { top: paddlebr.top, left: paddletl.left};
	var paddletr = { top: paddletl.top, left: paddlebr.left};
	
	if(playerSide == "left") {
		if(ballbl.left < paddletr.left && ballbl.top > paddletr.top && balltr.top<paddlebl.top && !hitBool) {
				socket.emit('ballHit', true);
				hitBool = true;
				updateHitBoolInterval = setInterval(updateHitBool, 1000);
		}
	}

	else {
		if(ballbr.left > paddletl.left && ballbr.top > paddletl.top && balltr.top<paddlebl.top && !hitBool) {
				socket.emit('ballHit', true);
				hitBool = true;
				updateHitBoolInterval = setInterval(updateHitBool, 500);
		}
	}
	
}

function updateHitBool() {
	hitBool = false;
	clearInterval(updateHitBoolInterval);
}

socket.on('ballLoc', function(loc) {
	$("#ball").offset(loc);
});

socket.on('opponentPaddleLoc', function(loc) {
	//alert(loc.id + " " + loc.paddleLoc.left);
	if(loc.id != playerNumber) {
		$("#" + oppSide + "Paddle").offset(loc.paddleLoc);
	}
});

var sendPaddleLocInterval = setInterval(sendPaddleLoc, 100);
var checkPaddleHitInterval = setInterval(checkHit, 100);
