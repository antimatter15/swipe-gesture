function $(sel){
	var s = document.querySelectorAll(sel);
	return s.length == 1 ? s[0] : [].slice.call(s, 0)
}

$('#dev').addEventListener('change', function(){
	$('#devmode').style.display = $('#dev').checked ? '' : 'none';
})

var options = [ "Disabled", "Forward", "Back", "Reload", "Next Tab", "Previous Tab", 'Open Settings']

function setSelect(i){
	var el = document.getElementById('a' + i);
	for(var j = 0; j < options.length; j++){
		var slug = options[j].replace(/ /g, '-').toLowerCase();
		el.options.add(new Option(options[j], slug))	
	}	
	el.addEventListener('change', function(){
		var obj = {};
		obj['a' + i] = el.value;
		chrome.storage.local.set(obj, function(){
			loadConfiguration();
		})
	})
}

for(var i = 0; i < 360; i += 45) setSelect(i); //configure each of the select things

$('#reverse').addEventListener('change', function(){
	var val = $('#reverse').checked;
	chrome.storage.local.set({INVERT_ARROW: val})
	INVERT_ARROW = val;
})

$('#thresh').addEventListener('change', function(){
	var val = +$('#thresh').value;
	chrome.storage.local.set({LENGTH_THRESHOLD: val});
	LENGTH_THRESHOLD = val;
})


function updateConfiguration(){
	$('#reverse').checked = INVERT_ARROW;
	$('#thresh').value = LENGTH_THRESHOLD;
	for(var i = 0; i < 360; i += 45){
		document.getElementById("a" + i).value = ACTION_MAP[i]
	}
}

function showWord(word){
	$('#modal').innerHTML = word;
	$('#modal').style.display = '';
	setTimeout(function(){
		$('#modal').style.opacity = '0.5';
	}, 10)
}

$('#modal').addEventListener('webkitTransitionEnd', function(){
	if(+$('#modal').style.opacity == 0){
		$('#modal').style.display = 'none';	
	}else{
		$('#modal').style.opacity = '0';	
	}
})

function signalCompletion(){
	var slugmap = {};
	for(var j = 0; j < options.length; j++){
		var slug = options[j].replace(/ /g, '-').toLowerCase();
		slugmap[slug] = options[j]
	}
	showWord(slugmap[ACTION_MAP[direction]])
	
}