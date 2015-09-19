var playerSide = "right";
var oppSide = "left";
var inside = true;

$( document ).ready(function() {
	$("#"+playerSide).mousemove(function(e){
		$("#playerPaddle").css({left:e.pageX, top:e.pageY});
	});
	$("#ball").mousemove(function(e){
		$("#playerPaddle").css({left:e.pageX, top:e.pageY});
	});
	$("#ball").offset($("#playerPaddle").offset());
});

var socket = io();

function sendPaddleLoc() {
    socket.emit('paddleLoc',$("#playerPaddle").offset());
}

function checkHit() {
	var balltl = $("#ball").offset();
	var ballbr = { top: balltl.top + $("#ball").height(), left: balltl.left + $("#ball").width()};
	var paddletl = $("#playerPaddle").offset();
	var paddlebr = { top: paddletl.top + $("#playerPaddle").height(), left: paddletl.left + $("#playerPaddle").width()};

	if(!(balltl.left>=(paddletl.left+paddlebr.left)/2) && ballbr.left > paddletl.left && ballbr.top > paddletl.top) {
		var paddlectr =  $("#playerPaddle").height()/2 + $("#ball").height();
		var ballctr = $("#ball").offset().top - ($("#playerPaddle").offset().top - $("#ball").height());
		alert(ballctr + " " + paddlectr);
		var angle = (paddlectr - ballctr) * 100 / paddlectr;
		//alert(angle);
		socket.emit('ballHit', angle);
	}
}

socket.on('ballLoc', function(loc) {
	$("#ball").offset(loc);
});

socket.on('opponentPaddleLoc', function(loc) {
	$("#opponentPaddleLoc").offset(loc);
});



var sendPaddleLocInterval = setInterval(sendPaddleLoc, 100);
var checkPaddleHitInterval = setInterval(checkHit, 2000);