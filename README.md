Apple Safari for OS X Lion style Back/Forward Gestures for Chrome

Basic principle:

	onmousewheel = function(e){
		if(Math.abs(e.wheelDeltaX) > 100) //go foward/back
	}

