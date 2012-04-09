/*
	Ideas for algorithm:
	triggered by swipe magnitude, ie. lots of force (or velocity?)
	Quickly numerically derive the magnitude somehow?
	Detect if it's been captured before?

	conditions:
		mag of x comp is > y comp (by what margin? )
		|dx| > 4 * |dy|

	"force" in units of px/s or px/s^2?
*/

var lastTime = 0;
var lastDelta = 0;
var lastSpeed = 0;
var lastAction = 0;

var thresh = 1; //1 pixel per second squared
var directionality = 4;
var actionDelay = 100;

window.addEventListener('mousewheel', function(e){
	var inv = e.webkitDirectionInvertedFromDevice ? 1 : -1;
	//if(Math.abs(e.wheelDeltaX) > 100 &&  Math.abs(e.wheelDeltaX) > Math.abs(e.wheelDeltaY)
	var timeDelta = e.timeStamp - lastTime;
	var speed = (e.wheelDeltaX)/(timeDelta);
	var accel = speed/timeDelta;

	if(timeDelta < 200 && timeDelta > 10){
		if(Math.abs(accel) > thresh){
			 if(Math.abs(e.wheelDeltaX) > directionality * Math.abs(e.wheelDeltaY)){
				if(new Date - lastAction > actionDelay){
					var direction = e.wheelDeltaX / Math.abs(e.wheelDeltaX);
					history.go(direction * inv);
				}
				lastAction = +new Date;
			}
		}

		lastSpeed = speed;
	}
	lastDelta = e.wheelDeltaX;
	lastTime = e.timeStamp;
}, true);