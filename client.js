var playerSide = "right";

$(document).ready(function() {
  	$("#" + playerSide).mouseover(function() {
		$("#" + playerSide).css("cursor","crosshair");
	});
});