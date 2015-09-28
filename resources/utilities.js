//general functions
"use strict";

function getMouse(e){ //get mouse position
	var mouse = {}
	mouse.x = e.pageX - e.target.offsetLeft;
	mouse.y = e.pageY - e.target.offsetTop;
	return mouse;	
}

function getRandom(min,max){ //get randome number between min and max
	return Math.random() * (max-min) + min;
}

function getColor(red, green, blue, alpha){ //get rgba color
	var color='rgba('+red+','+green+','+blue+', '+alpha+')';
	return color;	
}
