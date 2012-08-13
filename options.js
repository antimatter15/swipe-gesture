
var lastTime = 0;
var lastDelta = 0;
var lastSpeed = 0;
var peak = 0;
var thresh = 1;

var mag = 76;
var track = 0;
window.addEventListener('mousewheel', function(e){
	//var inv = webkitDirectionInvertedFromDevice;
	//if(Math.abs(e.wheelDeltaX) > 100 &&  Math.abs(e.wheelDeltaX) > Math.abs(e.wheelDeltaY)
	var timeDelta = e.timeStamp - lastTime;
	var speed = (e.wheelDeltaX)/(timeDelta);
	var accel = speed/timeDelta;
	if(e.wheelDeltaX == 0) return;

	if(timeDelta < 200 && timeDelta > 10){
		if(document.body.style.background == '')
			document.body.style.background = 'rgb(255,200,200)';

		if(Math.abs(accel) > thresh){
			document.body.style.background = 'rgb(200,255,200)';
		}
		peak = Math.max(peak, Math.abs(accel));
		lastSpeed = speed;
		document.getElementById('bar').style.width = mag * Math.abs(accel) + 'px';
		document.getElementById('peak').style.left = mag * peak + 'px';

	}

	lastDelta = e.wheelDeltaX;
	lastTime = e.timeStamp;
	//console.log(e.wheelDeltaX, +new Date)
	clearTimeout(track);
	track = setTimeout(endgame, 200);
}, true);


function endgame(){
	console.log(peak);
	peak = 0;
	document.body.style.background = '';
}

document.getElementById('thresh').style.left = mag * thresh + 'px';