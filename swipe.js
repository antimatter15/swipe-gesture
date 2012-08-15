
function drawArrow(canvas, orientation){
	// orientation = -orientation;
	orientation = (2 * 360 + (orientation || 0)) % 360;

	canvas.width = 50;
	canvas.height = 50;

	var c = canvas.getContext('2d');

	c.beginPath()
	c.fillStyle = 'white';

	var shaft_rad = 5, point_len = 15, head_rad = 15, shaft_len = 30;

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


var scrollListened = [];
var lastDetectedScroll = 0;
// var isTriggering = 0;
var wheelBuffer = [];
var lastWheelTimer = -1;
var direction;
var navArrow;

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

var len = 0;
function mouseWheel(x, y){
	x /= 2;
	y /= 2;

	var dp = Math.cos(direction / 180 * Math.PI) * x + Math.sin(direction / 180 * Math.PI) * y;
	
	len += dp;

	//dot product of direction and the stuff, why, i dont know im dumb
	// x = x / 500 * innerWidth
	// y = y / 500 * innerHeight
	var pct = Math.max(0, Math.min(1, len / 500));
	// console.log(dp, len, pct);
	renderProgress(pct);

	if(pct >= 0.75){
		// navArrow.style.backgroundColor = 'blue'
		//DONE!
		removeArrow(navArrow, true);
		// endTrigger()
		signalCompletion();
		currentSession = 3;
		
	}
	// console.log(x, y)
}

// var lastCompletion = 0;
function signalCompletion(){
	if(currentSession != 3){
		console.log('asdfja9ofjawerjwoaer', direction)
		// document.body.style.backgroundColor = '#B9D3B9';
	}
}

function renderProgress(pct){
	if(navArrow){
		// console.log(pct)
		// console.log(navArrow.style.left)
		if(pct == 0){
			navArrow.style.opacity = 0;
		}else{
			navArrow.style.opacity = pct * 0.4 + 0.1;	
		}
		
		if(direction == 180 || direction == 0){
			navArrow.style.top = (innerHeight / 2 - 25) + 'px';
		}else if(direction == 270 || direction == 90){
			navArrow.style.left = (innerWidth / 2 - 25) + 'px';
		}
		// pct = 1 - pct 
		if(direction == 180){ //LEFT
			// navArrow.style.left = (innerWidth * ( 1 - pct) - 70) + 'px';
			navArrow.style.right = innerWidth * pct + 'px';
		}else if(direction == 0){ //RIGHT
			navArrow.style.left = innerWidth * pct + 'px';
		}else if(direction == 270){ //UP
			// navArrow.style.top = (innerHeight * (1-pct) - 70) + 'px';
			navArrow.style.bottom = innerHeight * pct + 'px';
		}else if(direction == 90){ //DOWN
			navArrow.style.top = innerHeight * pct + 'px';
		}

	}
}


var currentSession = -1;
// 0 = unknown/not begun
// 1 = scroll
// 2 = MAGICALPONIES

function removeArrow(arrow, complete){

	if(arrow && arrow.style){
		if(complete){
			renderProgress(1)	
		}else if(currentSession != 3){
			renderProgress(0)
			arrow.style.webkitTransform = 'scale(2.0)';
			// document.body.style.backgroundColor = '#D1A5A5';
		}
		
		arrow.addEventListener('webkitTransitionEnd', function(){
			// console.log('removing tranny')
			var container = arrow.parentNode;

			if(container.parentNode)
				container.parentNode.removeChild(container);

		})
	}
}

function endTrigger(){
	if(navArrow){
		navArrow.style.webkitTransitionDuration = '0.5s, 0.5s, 0.5s, 0.5s, 0.5s, 0.5s'	
	}
	

	removeArrow(navArrow);
	currentSession = -1;
	wheelBuffer = [];
	len = 0;
	navArrow = null;
	clearTimeout(lastWheelTimer);
	// setTimeout(function(){
	// 	document.body.style.backgroundColor = '';
	// }, 500)
	
	
	console.log("DONE")
}

// var orientations = [180, 0, 45, 135, 90, 270]
var orientations = [180, 0, 90, 270]

window.addEventListener('mousewheel', function(e){
	clearTimeout(lastWheelTimer);
	lastWheelTimer = setTimeout(endTrigger, 500);

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
				return (2 * 360 + Math.atan2(y, x) / Math.PI * 180) % 360
			});
			var mean = angles.reduce(function(a, b){return a + b}) / angles.length;
			var sqerr = angles.map(function(e){ return (e - mean) * (e - mean) });
			var stdev = Math.sqrt(sqerr.reduce(function(a, b){return a + b})) / angles.length;
			
			var closest = orientations.sort(function(a, b){
				return Math.pow(mean - a, 2) - Math.pow(mean - b, 2)
			})[0];
			console.log(mean, stdev, closest);
			// console.log(wheelBuffer.length)
			if(checkpointScroll == lastDetectedScroll && wheelBuffer.length > 0 && stdev < 10 && Math.abs(closest - mean) < 10){
				console.log('creatin arrow')
				navArrow = createArrow();
				direction = closest;
				drawArrow(navArrow, closest);
				renderProgress(0)
			
				setTimeout(function(){
					if(currentSession != 0) return;
					if(checkpointScroll == lastDetectedScroll){
						currentSession = 2;
						// beginTrigger();
						// Okay, continue.
						// console.log("CONTINUE")
						// isTriggering = 2;
						// beginTrigger();
						for(var i = 0; i < wheelBuffer.length; i++){
							mouseWheel(wheelBuffer[i][0], wheelBuffer[i][1]);
						}
						wheelBuffer = [];
					}else{
						if(navArrow) navArrow.style.display = 'none';
						endTrigger();
						currentSession = 1;
						// isTriggering = 0;
						// wheelBuffer = []; //clear buffer
						// console.log("ABORT")
						//ABORT ABORT ABORT, the wheeling triggered a scroll
					}
				}, 10); // empirically, the margin is usually only about 3msecs
				// so having an order of magnitude's worth in leeway is probably
				// sufficient	
			}
			
		}, 150)
		
	}
})