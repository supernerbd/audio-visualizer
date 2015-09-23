//project specific scripts

"use strict";


//variables

//
var showMenu=false;
//var controls=false;
var width=window.innerWidth;
var height=window.innerHeight;
var NUM_SAMPLES = 256;
var SOUND_1 = 'media/New Adventure Theme.mp3';
var SOUND_2 = 'media/Peanuts Theme.mp3';
var SOUND_3 = 'media/The Picard Song.mp3';
var audioElement;
var analyserNode;
var canvas,ctx;

// pixel manip vars
var tintRed = false, tintBlue = false, tintGreen = false;
var noise = false, lines = false, bwNoise = false;
//animation vars
var mCircle = false, mSquare = false, circle = false, clines = false, invert = false;
var maxRadius=200;
//interactive vars


var delayAmount=0;
var delayNode;
//from juli tint blue, tint green, circle, squares

//Init and resize


function init(){
	document.querySelector('#canvas').width=width; //resize the canvas drawing area.
	document.querySelector('#canvas').height=height;
	canvas = document.querySelector ('#canvas');
	ctx = canvas.getContext('2d');
	//ctx.fillStyle = 'green';
	//ctx.fillRect(0,0,width,height);
	initAudio();
	setupUI();
	animation();
	//possible way to show/hide control bar. Yet buggi and not reliable. I work on an improvement.
	//canvas.onmousemove= function (){showControls(); 
	//	setTimeout(hideControls,3000); 
	//	console.log("init");}
}
window.onload = init;
//window.onresize = init;


//UI


function hamburger (){
	if(showMenu){
		document.querySelector("#menu").style.setProperty("display","none");
		showMenu=false;
	}
	else{
		document.querySelector("#menu").style.setProperty("display","inherit");
		showMenu=true;
	}
}
function setupUI(){
	document.querySelector("#trackSelect").onchange = function(e){
		playStream(audioElement,e.target.value);
	};
		document.querySelector("#fsButton").onclick = function(){
		requestFullscreen(canvas);
	};
	document.querySelector("#radius").onchange = function(e){
		maxRadius=e.target.value;
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
	/*document.querySelector("#delaySlider").onchange = function(e){
		delayAmount=e.target.value;
		delayNode.delayTime.value=delayAmount;
		
	};*/
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
//part of show/hide controlbar
//function showControls (){
	//document.querySelector("#controls").style.setProperty("display","inherit");
	//console.log("show")
//}
//function hideControls(){
	//document.querySelector("#controls").style.setProperty("display","none");
	//console.log("hide")
//}


//SOUND AND AUDIO


function initAudio(){
	audioElement = document.querySelector('audio');
	//Analyser
	analyserNode = createWebAudioContextWithAnalyserNode(audioElement);
	//start playing
	playStream(audioElement,SOUND_1);
}
function createWebAudioContextWithAnalyserNode(audioElement) {
	var audioCtx, analyserNode, sourceNode;
	// create new AudioContext
	// The || is because WebAudio has not been standardized across browsers yet
	// http://webaudio.github.io/web-audio-api/#the-audiocontext-interface
	audioCtx = new (window.AudioContext || window.webkitAudioContext);
		
	// create an analyser node
	analyserNode = audioCtx.createAnalyser();
	// create DelayNote instance
	delayNode=audioCtx.createDelay();
	delayNode.delayTime.value=delayAmount;
	/*
	We will request NUM_SAMPLES number of samples or "bins" spaced equally 
	across the sound spectrum.
	
	If NUM_SAMPLES (fftSize) is 256, then the first bin is 0 Hz, the second is 172 Hz, 
	the third is 344Hz. Each bin contains a number between 0-255 representing 
	the amplitude of that frequency.
	*/ 
			
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
function playStream(audioElement,path){
	audioElement.src = path;
	audioElement.play();
	audioElement.volume = 0.2;
}


//DRAWINGS


function animation(){
	requestAnimationFrame(animation); // this schedules a call to the animation() method in 1/60 seconds
	var data = new Uint8Array(NUM_SAMPLES/2); // create a new array of 8-bit integers (0-255)
	analyserNode.getByteFrequencyData(data); // populate the array with the frequency data. notice these arrays can be passed "by reference" 
	// OR
	//analyserNode.getByteTimeDomainData(data); // waveform data		
	
	// drawings
	ctx.clearRect(0,0,width,height);  
	var barWidth = Math.floor(width/data.length);
	var barSpacing = 1;
	var barHeight = height/2;
	var topSpacing = 50;
	
	for(var i=0; i<data.length; i++) { // loop through the data and draw!
		ctx.fillStyle = 'rgba(0,255,0,0.4)';
		var percent = data[i]/255;
		//Lines
		if(clines){
			ctx.save();
			ctx.strokeStyle="red";
			ctx.lineWidth=barWidth;
			ctx.beginPath();
			ctx.translate(0, canvas.height);
			ctx.scale(1, -1);
			ctx.moveTo(i*(barWidth + barSpacing),1);
			ctx.lineTo(i*(barWidth + barSpacing),data[i]);
			ctx.closePath();
			ctx.stroke();
			ctx.restore();
		}
		// the higher the amplitude of the sample (bin) the taller the bar
		// remember we have to draw our bars left-to-right and top-down
		//ctx.fillRect(i * (barWidth + barSpacing),topSpacing + 256-data[i],barWidth,barHeight); 
		// draw inverted bars
		//ctx.fillRect(640-i* (barWidth + barSpacing),topSpacing+256-data[i]-20,barWidth,barHeight);
			
		//circles in the middle
		if(mCircle){
			//red-ish circles
			var circleRadius = percent*maxRadius;
			ctx.beginPath();
			ctx.fillStyle=makeColor(255, 111, 111, .34-percent/3.0);
			ctx.arc(canvas.width/2, canvas.height/2, circleRadius, 0, 2*Math.PI, false);
			ctx.fill();
			ctx.closePath;
			//blue-ish circles, bigger, more transparent
			ctx.beginPath();
			ctx.fillStyle=makeColor(0,0,255, .10-percent/10.0);
			ctx.arc(canvas.width/2,canvas.height/2,circleRadius*1.5,0,2*Math.PI, false);
			ctx.fill();
			ctx.closePath();
			//yellow-ish circles, smaller
			ctx.save();
			ctx.beginPath();
			ctx.fillStyle=makeColor(200,200,0,.5-percent/5.0);
			ctx.arc(canvas.width/2, canvas.height/2,circleRadius*.50,0,2*Math.PI,false);
			ctx.fill();
			ctx.closePath();
			ctx.restore();
		}
		//Squares
		if(mSquare){
			var maxSize = 300;
			var rectSize = percent * maxSize;
			ctx.fillStyle = makeColor(Math.floor((Math.random() * 255) +1),0,Math.floor((Math.random() * 255) +1),.39 * percent/6);
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
				ctx.beginPath();
				ctx.translate((width/2-2) + i * (barWidth + barSpacing),topSpacing + (height/2+100)-data[i]);
				ctx.arc(0,0,10,0, Math.PI*2, false);
				ctx.closePath();
				ctx.stroke();
				ctx.restore();
				
				//draw inverted circles to the center
				ctx.save();
				ctx.beginPath();
				ctx.translate((width/2+2) - i * (barWidth + barSpacing),topSpacing + (height/2+100)-data[i]);
				ctx.arc(0,0,10,0, Math.PI*2, true);
				ctx.closePath();
				ctx.stroke();				
				ctx.restore();
				
				// HARD MODE MORE CIRCLES
				
				//draw circles to the center
				ctx.save();
				ctx.beginPath();
				ctx.translate((width/2-2) + i * (barWidth + barSpacing),topSpacing + (height/2-100)+data[i]);
				ctx.arc(0,0,10,0, Math.PI*2, false);
				ctx.closePath();
				ctx.stroke();
				ctx.restore();
				
				//draw inverted circles to the center
				ctx.save();
				ctx.beginPath();
				ctx.translate((width/2+2) - i * (barWidth + barSpacing),topSpacing + (height/2-100)+data[i]);
				ctx.arc(0,0,10,0, Math.PI*2, true);
				ctx.closePath();
				ctx.stroke();				
				ctx.restore();
		}
	}
	manipulatePixels(); 
} 
//drawing functions; used by several functions
function drawCricles(x, y, percent, maxRadius, fillStyle){
	var circleRadius = percent * maxRadius;
	ctx.beginPath();
	ctx.fillStyle = fillStyle;
	ctx.arc(x, y, circleRadius, 0, 2*Math.PI, false);
	ctx.fill();
	ctx.closePath;
}
function drawSquares(x, y, percent, maxSize, fillStyle){
	var rectSize = percent * maxSize;
	ctx.fillStyle = fillStyle;
	ctx.fillRect(x,y, rectSize, rectSize);
	ctx.fillRect(x,y, -rectSize, -rectSize);
	ctx.fillRect(x,y, rectSize, -rectSize);
	ctx.fillRect(x,y, -rectSize, rectSize);	
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
//user mouse interactions
function mouseAnimation(){
	getMouse();
}

//HELPER (didn't worked in the untilities file.)


function makeColor(red, green, blue, alpha){
	var color='rgba('+red+','+green+','+blue+', '+alpha+')';
	return color;
}
