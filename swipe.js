
function signalCompletion(){
	console.log('asdfja9ofjawerjwoaer', direction)
	// document.body.style.backgroundColor = '#B9D3B9';
}
function signalCancellation(){
	// document.body.style.backgroundColor = '#D1A5A5';
}
function signalScroll(){
	console.log('you see me scrolling') //my front lawn
	//i know you're all thinking he's so white and nerdy
	// document.body.style.backgroundColor = '#D7DB7F';
}
function signalEnd(){
	console.log("DONE")
	// setTimeout(function(){
	// 	document.body.style.backgroundColor = '';
	// }, 500)
}
function transformLength(x){ //x is a positive real number
	// return Math.sqrt(x)
	// return 1
	return x
}


var orientations = [180, 0, 315, 225, 90, 270, 135, 45];
var LENGTH_THRESHOLD = 1000;
var XY_SPLIT = 0.5; //50-50
var INVERT_ARROW = false;



function drawArrow(canvas, orientation){
	//parameters of drawing an arrow
	var shaft_rad = 5, 
		point_len = 15, 
		head_rad = 15, 
		shaft_len = 30;

	// orientation = -orientation;
	orientation = (2 * 360 + (orientation || 0)) % 360;

	canvas.width = 50;
	canvas.height = 50;

	var c = canvas.getContext('2d');

	c.beginPath()
	c.fillStyle = 'white';



	c.translate(25, 25)
	// c.scale(-1, 1)
	c.rotate(Math.PI/180 * orientation);
	// c.scale(-1, 1)

	var x = -(shaft_len + point_len) / 2, y = 0;

	c.moveTo(x, y - shaft_rad);
	c.lineTo(x + shaft_len, y - shaft_rad) // le shaft
	c.lineTo(x + shaft_len, y - head_rad) // arrow face
	c.lineTo(x + shaft_len + point_len, y) // le cusp
	c.lineTo(x + shaft_len, y + head_rad) // arrow face
	c.lineTo(x + shaft_len, y + shaft_rad) 
	c.lineTo(x, y + shaft_rad); // le shaft
	c.lineTo(x, y - shaft_rad); // the butt
	c.fill();
}

function createArrow(){
	var container = document.createElement('div');
	container.style.position = 'fixed';
	container.style.top = 0;
	container.style.left = 0;
	container.style.overflow = 'hidden';
	container.style.width = innerWidth + 'px';
	container.style.height = innerHeight + 'px';
	container.style.zIndex = '9999999999999999';

	var canvas = document.createElement('canvas');
	canvas.style.opacity = 0;
	canvas.style.background = 'black';
	canvas.style.borderRadius = '10px';
	canvas.style.padding = '10px';

	canvas.style.webkitTransitionProperty = 'opacity, -webkit-transform, transform, top, left, right, bottom';
	canvas.style.webkitTransitionDuration = '0.5s, 0.5s, 0.2s, 0.2s, 0.2s, 0.2s'
	canvas.style.position = 'absolute';
	canvas.style.zIndex = '9999999999999999';
	

	container.appendChild(canvas);
	document.body.appendChild(container)
	return canvas;
}

function renderProgress(pct){
	if(!navArrow) return; //nav arrow is necessary
	if(pct == 0){
		navArrow.style.opacity = pct;
	}else{
		navArrow.style.opacity = pct * 0.4 + 0.1;	
	}

	if(INVERT_ARROW){
		pct = 1 - pct;	
	}
	

	var boxEdge = 70;
	var nW = ((innerWidth + boxEdge) * pct - boxEdge) + 'px';
	var nH = ((innerHeight + boxEdge) * pct - boxEdge) + 'px';

	if(direction == 180 || direction == 0){
		navArrow.style.top = (innerHeight / 2 - boxEdge / 2) + 'px';
	}else if(direction == 270 || direction == 90){
		navArrow.style.left = (innerWidth / 2 - boxEdge / 2) + 'px';
	}
	//these are for the diags
	if(direction == 315 || direction == 225 || direction == 270){ // UP
		navArrow.style.bottom = nH;
	}else if(direction == 135 || direction == 45 || direction == 90){ //DOWN
		navArrow.style.top = nH;
	}
	if(direction == 315 || direction == 45 || direction == 0){ //RIGHT
		navArrow.style.left = nW;
	}else if(direction == 225 || direction == 135 || direction == 180){ //LEFT
		navArrow.style.right = nW;
	}
}


var scrollListened = [];
var lastDetectedScroll = 0;
var wheelBuffer = [];
var lastWheelTimer = -1;
var direction;
var navArrow;
var len = 0;
var currentSession = -1;
// 0 = unknown/not begun
// 1 = scroll
// 2 = MAGICALPONIES

function detectScroll(e){
	// console.log("detected scroll on", e.target, e, +new Date)
	lastDetectedScroll = +new Date;
	removeListeners();
}

function removeListeners(){
	for(var i = 0; i < scrollListened.length; i++){
		scrollListened[i].removeEventListener('scroll', detectScroll, false)
	}
	scrollListened = [];
}

function mouseWheel(x, y){
	//dot product of direction and the stuff, why, i dont know im dumb
	var dp = XY_SPLIT * Math.cos(direction / 180 * Math.PI) * x + (1-XY_SPLIT) * Math.sin(direction / 180 * Math.PI) * y;
	
	//give transformLength a positive thing just cause
	len += transformLength(Math.abs(dp)) * (dp < 0 ? -1 : 1);

	// x = x / 500 * innerWidth
	// y = y / 500 * innerHeight
	var pct = Math.max(0, Math.min(1, len / LENGTH_THRESHOLD));
	// console.log(dp, len, pct);
	renderProgress(pct);

	if(pct >= 0.80){
		//DONE!
		removeArrow(navArrow, true);
		if(currentSession != 3){
			signalCompletion();	
		}
		
		currentSession = 3;
	}
}

function removeArrow(arrow, complete){
	if(arrow && arrow.style){
		if(complete){
			renderProgress(1)	
		}else if(currentSession != 3){
			renderProgress(0)
			arrow.style.webkitTransform = 'scale(2.0)';
			signalCancellation()
		}
		
		arrow.addEventListener('webkitTransitionEnd', function(){
			// console.log('removing tranny')
			var container = arrow.parentNode;

			if(container.parentNode)
				container.parentNode.removeChild(container);

		})
	}
	if(arrow === navArrow){
		navArrow = null;
	}
}

function endTrigger(){
	if(navArrow){
		navArrow.style.webkitTransitionDuration = '0.5s, 0.5s, 0.5s, 0.5s, 0.5s, 0.5s'	
	}
	signalEnd();
	removeArrow(navArrow);
	currentSession = -1;
	wheelBuffer = [];
	len = 0;
	
	clearTimeout(lastWheelTimer);
	
}

function scrollTrigger(){
	if(navArrow) navArrow.style.display = 'none';
	// endTrigger();
	removeArrow(navArrow);
	wheelBuffer = [];
	currentSession = 1;
	signalScroll();
}


window.addEventListener('mousewheel', function(e){
	clearTimeout(lastWheelTimer);
	if(currentSession == 1 || currentSession == 3){
		lastWheelTimer = setTimeout(endTrigger, 500);	
	}else{
		lastWheelTimer = setTimeout(endTrigger, 1000);	
	}
	

	if(currentSession == 0 || currentSession == -1){
		//to convert wheelDeltas to cartesian, you have to flip it
		//because negative = scroll down
		wheelBuffer.push([-e.wheelDeltaX, -e.wheelDeltaY]);
	}
	if(currentSession == 2 || currentSession == 3){
		e.preventDefault();
		e.stopPropagation();
	}
	if(currentSession == 2){
		mouseWheel(-e.wheelDeltaX, -e.wheelDeltaY);

	}else if(currentSession == -1){
		removeListeners();
		var el = document.elementFromPoint(e.clientX, e.clientY);
		do {
			// console.log("parent", el);
			scrollListened.push(el);
			el.addEventListener('scroll', detectScroll, false);	
		} while (el = el.parentNode);
		var checkpointScroll = lastDetectedScroll;
		// isTriggering = 1;
		currentSession = 0;
		setTimeout(function(){
			var orientation = 0;
			// console.log(wheelBuffer)
			var angles = wheelBuffer.map(function(xy){
				var x = xy[0], y = xy[1];
				return (2 * 360 + Math.atan2(y, x) / Math.PI * 180) % 360;
			});
			var mean = angles.reduce(function(a, b){return a + b}) / angles.length;
			var sqerr = angles.map(function(e){ return (e - mean) * (e - mean) });
			var stdev = Math.sqrt(sqerr.reduce(function(a, b){return a + b})) / angles.length;
			
			var closest = orientations.sort(function(a, b){
				return Math.pow(mean - a, 2) - Math.pow(mean - b, 2)
			})[0];
			// console.log(mean, stdev, closest);
			// console.log(wheelBuffer.length)
			if(checkpointScroll == lastDetectedScroll && wheelBuffer.length > 0 && stdev < 15 && Math.abs(closest - mean) < 20){
				// console.log('creatin arrow')
				navArrow = createArrow();
				direction = closest;
				drawArrow(navArrow, closest);
				renderProgress(0)
			
				setTimeout(function(){
					if(currentSession != 0) return;
					if(checkpointScroll == lastDetectedScroll){
						currentSession = 2;
						for(var i = 0; i < wheelBuffer.length; i++){
							mouseWheel(wheelBuffer[i][0], wheelBuffer[i][1]);
						}
						wheelBuffer = [];
					}else{

						scrollTrigger()
						//ABORT ABORT ABORT, the wheeling triggered a scroll
					}
				}, 10); // empirically, the margin is usually only about 3msecs
				// so having an order of magnitude's worth in leeway is probably
				// sufficient	
			}else{
				scrollTrigger()
			}
			
		}, 150)
		
	}
})
