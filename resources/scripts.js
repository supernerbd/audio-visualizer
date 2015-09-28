//project specific scripts

"use strict";
//variables
var showMenu=false;
var width=window.innerWidth;
var height=window.innerHeight;
var NUM_SAMPLES = 256;
var MAXRADIUS = 200;
var SOUND_1 = 'media/Fake Orchestra.mp3'; 
var SOUND_2 = 'media/Flesh Maze Tango.mp3'; 
var SOUND_3 = 'media/Peper Steak'; 
var audioElement, delayNode, analyserNode;
var delayAmount=0;
var canvas,ctx;
var backgroundPic=false;
var backgroundColor="black";
var img;
// pixel manip vars
var tintRed = false, tintBlue = false, tintGreen = false;
var noise = false, lines = false, bwNoise = false;
//animation vars
var mCircle = false, mSquare = true, circle = true, clines = true, invert = false;
var data, dataW, percent;
//interactive vars
var clickEnabled=true, controlsOn=false;
// mouse control vars

var mouse;
var cCounter=0;
var clicks = new Array(); //init array
for (var i=0; i<20; i++){
	clicks[i]=0;
}
//Init and resize


function init(){ //init canvas, audio, animation and ui
	document.querySelector('#canvas').width=width; //resize the canvas drawing area.
	document.querySelector('#canvas').height=height;
	canvas = document.querySelector ('#canvas');
	ctx = canvas.getContext('2d');
	initAudio();
	setupUI();
	animation();
}
window.onload = init;


//UI
function setupUI(){ //setup all eventListener and eventHandler
		canvas.addEventListener("mousedown", function(e){ //mouse control
		if (clickEnabled){
			mouse = getMouse(e);
			clicks[cCounter]=mouse.x;
			cCounter++;
			clicks[cCounter]=mouse.y;
			cCounter++;
			if(cCounter>=20){ //Max 10 clicks possible after that it is reset to 0.
				cCounter=0;
				for (var i=0; i<20; i++){
					clicks[i]=0;
				}
			}
		}
	});
	document.querySelector("#trackSelect").onchange = function(e){
		playStream(audioElement,e.target.value);
	};
	document.querySelector("#backgroundSelect").onchange = function(e){
		if (e.target.value=="none"){backgroundPic=false;}
		else{
		backgroundPic=true;
		img=document.getElementById(e.target.value);}
	};
	document.querySelector("#clickButton").onclick = function(){
		if (clickEnabled){
			clickEnabled=false;
		}
		else{
			clickEnabled=true;
		}
	}
	document.querySelector("#controlsButton").onclick = function(){
		if (controlsOn) {
			document.querySelector("#controls").style.setProperty("display","none");
			document.querySelector("#controls").style.setProperty("display","none");
			controlsOn=false;
		}
		else{
			document.querySelector("#controls").style.setProperty("display","inherit");
			controlsOn=true;
		}
	}
	document.querySelector("#backgroundSelectColor").onchange = function(e){
		backgroundColor=e.target.value;
	};
	document.querySelector("#fsButton").onclick = function(){
		requestFullscreen(canvas);
	};
	document.querySelector("#radius").onchange = function(e){
		MAXRADIUS=e.target.value;
	};
	document.querySelector("#red").onchange = function(e){
		if(e.target.checked){
			tintRed=true;
		}
		else{
			tintRed=false;
		}
	};
	document.querySelector("#blue").onchange = function(e){
		if(e.target.checked){
			tintBlue=true;
		}
		else{
			tintBlue=false;
		}
	};
	document.querySelector("#green").onchange = function(e){
		if(e.target.checked){
			tintGreen=true;
		}
		else{
			tintGreen=false;
		}
	};
	document.querySelector("#invert").onchange = function(e){
		if(e.target.checked){
			invert=true;
		}
		else{
			invert=false;
		}
	};
	document.querySelector("#noise").onchange = function(e){
		if(e.target.checked){
			noise=true;
		}
		else{
			noise=false;
		}
	};
	document.querySelector("#lines").onchange = function(e){
		if(e.target.checked){
			lines=true;
		}
		else{
			lines=false;
		}
	};
	document.querySelector("#bwNoise").onchange = function(e){
		if(e.target.checked){
			bwNoise=true;
		}
		else{
			bwNoise=false;
		}
	};
	document.querySelector("#mCircle").onchange = function(e){
		if(e.target.checked){
			mCircle=true;
		}
		else{
			mCircle=false;
		}
	};
	document.querySelector("#mSquare").onchange = function(e){
		if(e.target.checked){
			mSquare=true;
		}
		else{
			mSquare=false;
		}
	};
	document.querySelector("#circle").onchange = function(e){
		if(e.target.checked){
			circle=true;
		}
		else{
			circle=false;
		}
	};
	document.querySelector("#clines").onchange = function(e){
		if(e.target.checked){
			clines=true;
		}
		else{
			clines=false;
		}
	};
	document.querySelector("#delaySlider").onchange = function(e){
		delayAmount=e.target.value;
		delayNode.delayTime.value=delayAmount;
		
	};
}
 // Full Screen
function requestFullscreen(element) {
	if (element.requestFullscreen) {
	  element.requestFullscreen();
	} else if (element.mozRequestFullscreen) {
	  element.mozRequestFullscreen();
	} else if (element.mozRequestFullScreen) { // camel-cased 'S' was changed to 's' in spec
	  element.mozRequestFullScreen();
	} else if (element.webkitRequestFullscreen) {
	  element.webkitRequestFullscreen();
	}
	// .. and do nothing if the method is not supported
};

//SOUND AND AUDIO


function initAudio(){ //init audio
	audioElement = document.querySelector('audio');
	//Analyser
	analyserNode = createWebAudioContextWithAnalyserNode(audioElement);
	//start playing
	playStream(audioElement,SOUND_1);
}
function createWebAudioContextWithAnalyserNode(audioElement) { //create audio notes connections
	var audioCtx, analyserNode, sourceNode;
	// create new AudioContext
	audioCtx = new (window.AudioContext || window.webkitAudioContext);
		
	// create an analyser node
	analyserNode = audioCtx.createAnalyser();
	// create DelayNote instance
	delayNode=audioCtx.createDelay();
	delayNode.delayTime.value=delayAmount;	
	// fft stands for Fast Fourier Transform
	analyserNode.fftSize = NUM_SAMPLES;
	
	// this is where we hook up the <audio> element to the analyserNode
	sourceNode = audioCtx.createMediaElementSource(audioElement); 
	//sourceNode.connect(analyserNode);
	
	// here we connect to the destination i.e. speakers
	//analyserNode.connect(audioCtx.destination);
	sourceNode.connect(audioCtx.destination);
	sourceNode.connect(delayNode);
	delayNode.connect(analyserNode);
	analyserNode.connect(audioCtx.destination);
	return analyserNode;
}
function playStream(audioElement,path){ //playing audio streams
	audioElement.src = path;
	audioElement.play();
	audioElement.volume = 0.2;
}


//DRAWINGS


function animation(){ //animations on canvas
	requestAnimationFrame(animation); // this schedules a call to the animation() method in 1/60 seconds
	data = new Uint8Array(NUM_SAMPLES/2); // create a new array of 8-bit integers (0-255)
	analyserNode.getByteFrequencyData(data); // populate the array with the frequency data. notice these arrays can be passed "by reference" 	
	
	// drawings
	ctx.fillStyle=backgroundColor;
	ctx.fillRect(0,0,width,height); 
	var barWidth = Math.floor(width/data.length);
	var barSpacing = 1;
	var barHeight = height/2;
	var topSpacing = 50;
	//Lines only when on. Uses waveform.
	if(clines){
		dataW = new Uint8Array(NUM_SAMPLES/2);
		analyserNode.getByteTimeDomainData(dataW);
		var barWidthW = Math.floor(width/dataW.length);
		for(var i=0; i<dataW.length; i++) { 
			dataW[i]=dataW[i]*1.5; 
			ctx.save();
			ctx.strokeStyle=drawGradients();
			ctx.lineWidth=barWidth;
			ctx.beginPath();
			ctx.translate(0, canvas.height);
			ctx.scale(1, -1);
			ctx.moveTo(i*(barWidthW + barSpacing),1);
			ctx.lineTo(i*(barWidth + barSpacing),dataW[i]);
			ctx.closePath();
			ctx.stroke();
			ctx.restore();
		}
	}
	//Background only when selected
	if (backgroundPic==true){
		ctx.drawImage(img,0,0);}
	//Rest
	for(var i=0; i<data.length; i++) { // loop through the data and draw!
		ctx.fillStyle = 'rgba(0,255,0,0.4)';
		ctx.strokeStyle= 'rgba(0,255,0,0.4)';
		percent = data[i]/255;
			
		//circles in the middle
		if(mCircle){
			//red-ish circles
			var circleRadius = percent*MAXRADIUS;
			
			ctx.save();
			drawCircles(canvas.width/2,canvas.height/2,percent,MAXRADIUS, getColor(255, 111, 111, .34-percent/3.0), 'rgba(0,0,0,0)');
			ctx.restore();
			//blue-ish circles, bigger, more transparent
			ctx.save();
			drawCircles(canvas.width/2,canvas.height/2,percent,MAXRADIUS*1.5, getColor(0,0,255, .10-percent/10.0), 'rgba(0,0,0,0)');
			ctx.restore();
			//yellow-ish circles, smaller
			ctx.save();
			drawCircles(canvas.width/2, canvas.height/2, percent, MAXRADIUS*.50, getColor(200,200,0,.5-percent/5.0),'rgba(0,0,0,0)');
			ctx.restore();
		}
		//Squares
		if(mSquare){
			var maxSize = 300;
			var rectSize = percent * maxSize;
			ctx.fillStyle = getColor(Math.floor((Math.random() * 255) +1),0,Math.floor((Math.random() * 255) +1),.39 * percent/6);
			ctx.fillRect(canvas.width/2,canvas.height/2, rectSize, rectSize);
			ctx.fillRect(canvas.width/2,canvas.height/2, -rectSize, -rectSize);
			ctx.fillRect(canvas.width/2,canvas.height/2, rectSize, -rectSize);
			ctx.fillRect(canvas.width/2,canvas.height/2, -rectSize, rectSize);
		}
		
		//mini circles
		if(circle){
			//draw circles to the center
				ctx.strokeStyle = 'rgba(0,255,0,0.6)'; 
				ctx.strokeWidth = 5;
				
				
				ctx.save();				
				ctx.translate((width/2-2) + i * (barWidth + barSpacing),topSpacing + (height/2+100)-data[i]);
				drawCircles(0,0,1,10, 'rgba(0,0,0,0)', 'rgba(0,255,0,1)');
				ctx.restore();
				
				//draw inverted circles to the center
				ctx.save();
				ctx.translate((width/2+2) - i * (barWidth + barSpacing),topSpacing + (height/2+100)-data[i]);
				drawCircles(0,0,1,10, 'rgba(0,0,0,0)', 'rgba(0,255,0,1)');			
				ctx.restore();
				
				//draw circles to the center
				ctx.save();
				ctx.translate((width/2-2) + i * (barWidth + barSpacing),topSpacing + (height/2-100)+data[i]);
				drawCircles(0,0,1,10, 'rgba(0,0,0,0)', 'rgba(0,255,0,1)');
				ctx.restore();
				
				//draw inverted circles to the center
				ctx.save();
				ctx.translate((width/2+2) - i * (barWidth + barSpacing),topSpacing + (height/2-100)+data[i]);
				drawCircles(0,0,1,10, 'rgba(0,0,0,0)', 'rgba(0,255,0,1)');
				ctx.restore();
		}
		//mouse fucntion
		//draw circle at each x and y in array
		for (var j=0; j<=clicks.length; j++){ //goes through array with click x's and y's
			if(j%2==0 && clicks[j]!=0 && clicks[j+1]!=0){ //if even number and x and y are not 0
				drawCircles(clicks[j], clicks[j+1], percent, MAXRADIUS, getColor(Math.floor((Math.random() * 255) +1),0,Math.floor((Math.random() * 255) +1),.39 * percent/6), getColor(Math.floor((Math.random() * 255) +1),0,Math.floor((Math.random() * 255) +1),.39 * percent/6));
			} //clicks[j]==x, clicks[j+1]==y
		}
	}
	manipulatePixels(); 
} 
// function for mouse control
function drawCircles(x, y, percent, maxRadius, fillStyle, strokeStyle){ //draw circle on x and y of each of the mouse clicks
	var circleRadius = percent * maxRadius;
	ctx.beginPath();
	ctx.fillStyle = fillStyle;
	ctx.strokeStyle = strokeStyle;
	ctx.arc(x, y, circleRadius, 0, 2*Math.PI, false);
	ctx.fill();
	ctx.stroke();
	ctx.closePath;
}
//Gradient
function drawGradients() {
		var grad = ctx.createLinearGradient(0,0,width,height);
		grad.addColorStop(0, 'red');
		grad.addColorStop(1 / 6, 'orange');
		grad.addColorStop(2 / 6, 'yellow');
		grad.addColorStop(3 / 6, 'green')
		grad.addColorStop(4 / 6, 'aqua');
		grad.addColorStop(5 / 6, 'blue');
		grad.addColorStop(1, 'purple');
		return grad;
	}
// Pixel Manipulation
function manipulatePixels(){
	var imageData=ctx.getImageData(0,0,canvas.width,canvas.height);
	var data=imageData.data;
	var length=data.length;
	var width=imageData.width;
			
	//manipulate through each pixel
	for (var i=0;i<length;i+=4){
		//color
		if(tintRed){
			data[i]=data[i]+100;
		}
		if(tintBlue) {
			data[i+1] = data[i] + 100;
		}
		if(tintGreen) {
			data[i+2] = data[i] + 100;
		}
		//inverted
		if(invert){
			var red=data[i], green=data[i+1], blue=data[i]+2;
			data[i]=255-red;
			data[i+1]=255-green;
			data[i+2]=255-blue;
		}
		//noise
		if(noise&&Math.random()<.10){
			data[i]=data[i+1]=data[i+2]=128;
		}
		//black and white noise
		if(bwNoise&&Math.random()<.10){
			if(data[i]%5==0){
				data[i]=data[i+1]=data[i+2]=0;
			}
			else{
				data[i]=data[i+1]=data[i+2]=255;
			}
		}
		//lines
		if(lines){
			var row=Math.floor(i/4/width);
			if (row%50==0){
				data[i]=data[i+1]=data[i+2]=data[i+3]=255;
				data[i+(width*4)]=data[i+(width*4)+1]=data[i+(width*4)+2]=data[i+(width*4)+3]=255;
			}
		}
	}
ctx.putImageData(imageData,0,0);
}