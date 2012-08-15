
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
var LENGTH_THRESHOLD = 500;
var XY_SPLIT = 0.5; //50-50
var INVERT_ARROW = false;

function drawArrow(canvas, orientation){
	//parameters of drawing an arrow
	var shaft_rad = 5, 
		point_len = 15, 
		head_rad = 15, 
		shaft_len = 30;

	orientation = (2 * 360 + (orientation || 0)) % 360;

	canvas.width = 50;
	canvas.height = 50;

	var c = canvas.getContext('2d');

	c.beginPath()
	c.fillStyle = 'white';
	c.translate(25, 25)
	c.rotate(Math.PI/180 * orientation);

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
	container.className = 'swipe-gestures-container-element';

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
	canvas.style.webkitTransitionDuration = '0.5s, 0.5s, 0s, 0s, 0s, 0s'
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

	if(INVERT_ARROW) pct = 1 - pct;	
	
	var boxEdge = 50 + 10 * 2; //50px w/h + 10px padding
	
	//CAVEAT EMPTOR, the 45deg multiples render slightly off
	//but fixing that might incur moar code, ergo not doing it
	//not now at least, but if you feel like doing it, have fun

	var nW = ((innerWidth + boxEdge) * pct - boxEdge) + 'px';
	var nH = ((innerHeight + boxEdge) * pct - boxEdge) + 'px';
	// console.log(nW, nH)
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
	console.log("detected scroll on", e.target, e, +new Date)
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
	// if(navArrow && x % 10 == 0 && y % 10 == 0 && (Math.abs(x) > 100 || Math.abs(y) > 100)){
	// 	navArrow.style.webkitTransitionDuration = '0.5s, 0.5s, 0.5s, 0.2s, 0.2s, 0.2s';
	// }

	//dot product of direction and the stuff, why, i dont know im dumb
	var ty = XY_SPLIT * y, tx = (1 - XY_SPLIT) * x;
	var r_dir = direction / 180 * Math.PI;
	var r_cmp = Math.atan2(ty, tx);
	var mag = Math.sqrt(ty*ty + tx*tx);
	var dp = mag * Math.cos(r_cmp - r_dir);
	var ortho = mag * Math.sin(r_cmp - r_dir)

	// console.log(Math.round(xortho), Math.round(ortho))
	//give transformLength a positive thing just cause
	len += transformLength(Math.abs(dp)) * (dp < 0 ? -1 : 1) - Math.abs(ortho / 3); //subtract ortho to punish deviation

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
			arrow.style.webkitTransitionDuration = '0.5s, 0.5s, 0.2s, 0.2s, 0.2s, 0.2s'	
			renderProgress(1)	
		}else if(currentSession != 3){
			arrow.style.webkitTransitionDuration = '0.5s, 0.5s, 0.5s, 0.5s, 0.5s, 0.5s';
			renderProgress(0)
			arrow.style.webkitTransform = 'scale(2.0)';
			signalCancellation()
		}
		
		arrow.addEventListener('webkitTransitionEnd', function(){
			var gc;
			while(gc = document.querySelector('.swipe-gestures-container-element'))
				gc.parentNode.removeChild(gc);
		})
	}
	if(arrow === navArrow){
		navArrow = null;
	}
}

function endTrigger(){
	signalEnd();
	removeArrow(navArrow);
	currentSession = -1;
	wheelBuffer = [];
	len = 0;
	clearTimeout(lastWheelTimer);
}

function scrollTrigger(){
	if(navArrow) navArrow.style.display = 'none';
	removeArrow(navArrow);
	wheelBuffer = [];
	currentSession = 1;
	signalScroll();
	var gc;
	while(gc = document.querySelector('.swipe-gestures-container-element'))
		gc.parentNode.removeChild(gc);
}


function wheelEvent(e){
	clearTimeout(lastWheelTimer);

	//to convert wheelDeltas to cartesian, you have to flip it
	//because negative = scroll down

	var deltaX = -e.wheelDeltaX, deltaY = -e.wheelDeltaY;

	if(currentSession == 1){
		lastWheelTimer = setTimeout(endTrigger, 600);
	}else if(currentSession == 3){
		lastWheelTimer = setTimeout(endTrigger, 400);	
	}else{
		lastWheelTimer = setTimeout(endTrigger, 900);	
	}
	
	if(currentSession == 0 || currentSession == -1){
		wheelBuffer.push([deltaX, deltaY]);
	}
	if(currentSession == 2 || currentSession == 3){
		if(len > LENGTH_THRESHOLD * 0.01){
			e.preventDefault();
			e.stopPropagation();	
		}else if(len < -0.1 * LENGTH_THRESHOLD){
			scrollTrigger();
		}
	}
	if(currentSession == 2){
		mouseWheel(deltaX, deltaY);

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
			var mag_sum = 0, ang_sum = 0;
			var angles = wheelBuffer.forEach(function(xy){
				var x = xy[0], y = xy[1], mag = Math.sqrt(x * x + y * y);
				mag_sum += mag;
				ang_sum += ((2 * 360 + Math.atan2(y, x) / Math.PI * 180) % 360) * mag;
			});
			var mean = ang_sum / Math.max(1, mag_sum);
			
			var closest = orientations.sort(function(a, b){
				return Math.pow(mean - a, 2) - Math.pow(mean - b, 2)
			})[0];
			// console.log(mean, stdev, closest);
			// console.log(wheelBuffer.length)
			if(checkpointScroll == lastDetectedScroll && 
				wheelBuffer.length > 0 && 
				// stdev < 15 && 
				Math.abs(closest - mean) < 30
			){
				direction = closest;
				navArrow = createArrow();
				drawArrow(navArrow, closest);
				renderProgress(0)
				currentSession = 2;
				wheelBuffer = [];
			
			}else{
				scrollTrigger()
			}
			
		}, 100)
		// empirically, the margin is usually only about 3msecs
		// so having an order of magnitude's worth in leeway is probably
		// sufficient
	}
}

window.addEventListener('mousewheel', wheelEvent);