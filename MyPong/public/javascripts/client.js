var playerSide = "right";
var oppSide = "left";

$(document).mousemove(function(e){
    $("#playerPaddle").css({left:e.pageX, top:e.pageY});
});
