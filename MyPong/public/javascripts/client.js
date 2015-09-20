
var myname = null;

var playerSide, oppSide;
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
	var paddletl = $("#leftPaddle").offset();
	var paddlebr = { top: paddletl.top + $("#" + playerSide + "Paddle").height(), left: paddletl.left + $("#" + playerSide + "Paddle").width()};
	var paddlebl = { top: paddlebr.top, left: paddletl.left};
	var paddletr = { top: paddletl.top, left: paddlebr.left};
	
	if(playerSide == "left") {
		if(balltl.left>(paddletl.left+paddlebr.left)/2 && ballbl.left < paddletr.left && ballbl.top > paddletr.top) {
			var paddlectr =  $("#" + playerSide + "Paddle").height()/2 + $("#ball").height();
			var ballctr = $("#ball").offset().top - ($("#" + playerSide + "Paddle").offset().top - $("#ball").height());
			var angle = (paddlectr - ballctr) * 100 / paddlectr;
			if(angle<=85 && angle>=-45) {
				angle -= 20;
				//alert(angle);
				socket.emit('ballHit', true);
			}
		}
	}

	else {
		if(!(balltl.left>=(paddletl.left+paddlebr.left)/2) && ballbr.left > paddletl.left && ballbr.top > paddletl.top) {
			var paddletop =  ($("#" + playerSide + "Paddle").height() + $("#ball").height())/2;
			var balltop = $("#ball").offset().top - $("#ball").height();
			var angle = (paddlectr - ballctr) * 100 / paddlectr;
			if(angle<=85 && angle>=-45) {
				angle -= 20;
				angle = 180 - angle;
				//alert(angle);
				socket.emit('ballHit', true);
			}
		}
	}
	
}

socket.on('ballLoc', function(loc) {
	$("#ball").offset(loc);
});

socket.on('opponentPaddleLoc', function(data) {
    if(data.id !== document.cookie){
	   $("#opponentPaddleLoc").offset(data.paddleLoc);
    }
});


var sendPaddleLocInterval = setInterval(sendPaddleLoc, 100);
var checkPaddleHitInterval = setInterval(checkHit, 100);
