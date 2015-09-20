var socket = io();
$( document ).ready(function() {
	$("#player1").click(function() {
		socket.emit('player', "1");
		document.cookie = "1";
	});

	$("#player2").click(function() {
		socket.emit('player', "2");
		document.cookie = "2";
	});

	socket.on('playerTaken', function(num) {
		if(num=="1") {
			$("#player1").hide();
		}
		else {
			$("#player2").hide();
		}
	});
	socket.on('startGame', function() {
		window.location.replace("./games");
	});
});