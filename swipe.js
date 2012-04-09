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
window.addEventListener('mousewheel', function(e){
	//var inv = webkitDirectionInvertedFromDevice;
	//if(Math.abs(e.wheelDeltaX) > 100 &&  Math.abs(e.wheelDeltaX) > Math.abs(e.wheelDeltaY)
}, true);