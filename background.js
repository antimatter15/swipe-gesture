chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.action == "reload"){
		chrome.tabs.reload(sender.tab.id);
	}else if(request.action == "open-settings"){
		chrome.tabs.create({url: "options.html"})
	}else if(request.action == "new-tab"){
		chrome.tabs.create({})
	}else if(request.action == "next-tab" || request.action == 'previous-tab'){
		var offset = (request.action == "next-tab") ? 1 : -1;
		chrome.windows.get(sender.tab.windowId, {populate: true}, function(e){
			var tab = e.tabs[(sender.tab.index + e.tabs.length + offset) % e.tabs.length];
			//wrap around!
			chrome.tabs.update(tab.id, {
				active: true
			})
		})
	}else if(request.action == "back"){
		sendResponse('history.go(-1)')
	}else if(request.action == "forward"){
		sendResponse('history.go(1)')
	}
	console.log(sender)
});