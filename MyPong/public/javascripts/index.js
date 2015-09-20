var socket = io();

$( document ).ready(function() {
	$("#player1").click(function() {
		socket.emit('player', "1");
	});

	$("#player2").click(function() {
		socket.emit('player', "2");
	});

	socket.on('playerTaken', function(num) {
		if(num=="1") {
			$("#player1").hide();
		}
		else {
			$("#player2").hide();
		}
	});
});