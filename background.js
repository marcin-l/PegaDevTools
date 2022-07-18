var browser = (browser)? browser : chrome;

function injectScript(injectedScript, tabId, frameId) {
	browser.scripting.executeScript({
		files: [injectedScript],
		target: { tabId: tabId, frameIds: [frameId] },
		world: "MAIN",
	});
}

function appendScript(appendedScript, tabId, frameId) {
	browser.scripting.executeScript({
		func: appendedScript,
		target: { tabId: tabId, frameIds: [frameId] },
		world: "MAIN",
	});
}

var tracerIsRunningAppended = false;
// handle content script messages
browser.runtime.onMessage.addListener(async  (request, sender, sendResponse) => {
	console.debug(request);
	if (request.purpose == "getFrameId")
		sendResponse({ frameId: sender.frameId });
	else if (request.purpose == "paragraphRule") {
		injectScriptsToIframe(sender.tab.id, sender.frameId, paragraphScriptList);
		sendResponse("ok ");
	} else if (request.purpose == "appendScript") {
		appendScript(request.appendedScript, sender.tab.id, sender.frameId);
		sendResponse("appending to tab " + sender.tab.id + " frame " + sender.frameId);
	} else if (request.purpose == "injectScript") {
		injectScript(request.injectedScript, sender.tab.id, sender.frameId);
		sendResponse("injecting " + request.injectedScript + " to tab " + sender.tab.id + " frame " + sender.frameId);
	} else if (request.purpose == "tracerState" && arrDevTabs.get(sender.origin)) {
	//TODO: try Long-lived connections https://developer.chrome.com/docs/extensions/mv3/messaging/#connect 

		if (request.tracerIsOn && !tracerIsRunningAppended) {
			arrTracerTabs.set(sender.origin, sender.tab.id);
			//TODO: append in devstudio.js instead?
			appendScript(tracerIsRunning, arrDevTabs.get(sender.origin), 0);
			tracerIsRunningAppended = true;
		}
		else
			appendScript(tracerIsOff, arrDevTabs.get(sender.origin), 0);      
	} else if (request.purpose == "tracerHeartbeat" && arrDevTabs.get(sender.origin)) {
		appendScript(tracerHeartbeat, arrDevTabs.get(sender.origin), 0);
	} else if (request.purpose == "registerDevStudio") {
		arrDevTabs.set(sender.origin, sender.tab.id);
	} else if (request.purpose == "registerTracer") {
		arrTracerTabs.set(sender.origin, sender.tab.id);
	} else if (request.purpose == "tracerStop") {
		appendScript(tracerStop, arrTracerTabs.get(sender.origin), 0);
	} else if (request.purpose == "tracerFocus") {
		if(arrTracerTabs.has(sender.origin)) {
			browser.windows.update(arrTracerTabs.get(sender.origin), { "focused": true} );
			sendResponse("OK");
		} else {
			sendResponse("NOK");
		}
	}  else if (request.purpose == "getManifest") {		
		sendResponse(browser.runtime.getManifest());
	}

	return true;
});

//<div onclick="handleCases(updatePausePlayButton(event));" " name="Pause"><div class="iconToolbarPause"></div><div class="TracerIconStyling">Pause</div></div>

function tracerIsRunning() {
	let counter = 0, heartbeat, hasHeartbeat = true;
	document.querySelector("div.create-case span").insertAdjacentHTML("afterend", "<div id='PDTTracerIndicator'><button id='PDTDevTracerPlayPause' type='button'>ıı</button><div id='PDTTracerState' class='Header_nav margin-1x'>Tracer&nbsp;active!</div></div>");
	let tracerIndicator	= document.querySelector("div#PDTTracerIndicator");
	document.querySelector("button#PDTDevTracerPlayPause").addEventListener("click", function(event) { browser.runtime.sendMessage({ purpose: "tracerStop"}) });
	
	let titleTimerId = setInterval(function () {
		heartbeat = document.querySelector("input#PDTTracerHeartbeat").value;
		if (hasHeartbeat && (heartbeat === "off" || (Math.floor(Date.now() / 1000) - heartbeat) > 4)) {
			console.log("PDT Tracer heartbeat lost " + heartbeat + " " + Math.floor(Date.now() / 1000));
			//clearInterval(titleTimerId);
			if(tracerIndicator)
				tracerIndicator.style.display = "none";
			hasHeartbeat = false;
		} else if(tracerIndicator && heartbeat !== "off") {
			tracerIndicator.style.display = "block";				
			console.log("PDT Tracer heartbeat read " + heartbeat + " at " + Math.floor(Date.now() / 1000));
			document.querySelector('button#PDTDevTracerPlayPause').innerText = '►';
			counter++;
			if ((counter % 2) == 0) {
				document.querySelector('button#PDTDevTracerPlayPause').innerText = "ıı"
			}
			hasHeartbeat = true;
		}
	}, 1000);
}

function tracerIsOff() {
	let tracerIndicator	= document.querySelector("div#PDTTracerIndicator");
  	if(tracerIndicator) {
		tracerIndicator.style.display = "none";
	}
	tracerHeartbeat("off");
}

function tracerHeartbeat(heartbeatValue) {
  	let heartbeat = document.querySelector("input#PDTTracerHeartbeat");
  	if(!heartbeatValue) {
  		heartbeatValue = Math.floor(Date.now() / 1000);
  	}

	if(heartbeat) {
    	heartbeat.value = heartbeatValue;
	} else {
    	document.body.insertAdjacentHTML('afterbegin', '<input type="hidden" id="PDTTracerHeartbeat" value="' + heartbeatValue + '" />');
	}

  console.log("PDT Tracer heartbeat received " + heartbeatValue);
}

function tracerStop() {
	document.getElementById("Pause").click();
}

const injectScriptsToIframe = (tabId, frameId, scriptList) => {
	browser.scripting.executeScript({
		files: scriptList,
		target: { tabId: tabId, frameIds: [frameId] },
		world: "MAIN",
	});

	// scriptList.forEach((script) => {
	//   console.log("PDT executeScript tabId: " + tabId + ", frameId: " + frameId + ": " + `${script}`);
	//   browser.scripting.executeScript({
	//     files: [injectedScript],
	//     target: { tabId: tabId, frameIds: [frameId] },
	//     world: "MAIN"
	//   });

	//   browser.tabs.executeScript(tabId, {
	//     file: `${script}`,
	//     runAt: 'document_end',
	//     frameId: frameId
	//     //If the script injection fails (without the tab permission and so on) and is not checked in the callback` runtime.lastError `，
	//     //It's a mistake. There is no other complicated logic in this example. You don't need to record the tab of successful injection. You can fool it like this.
	//   }, () => void browser.runtime.lastError);
	// });
};

var arrDevTabs = new Map(), arrTracerTabs = new Map();

const paragraphScriptList = [
	"resources/codemirror/codemirror.js",
	"resources/codemirror/foldcode.js",
	"resources/codemirror/foldgutter.js",
	"resources/codemirror/brace-fold.js",
	"resources/codemirror/indent-fold.js",
	"resources/codemirror/comment-fold.js",
	"resources/codemirror/xml-fold.js",
	"resources/codemirror/matchtags.js",
	"resources/codemirror/closetag.js",
	"resources/codemirror/fullscreen.js",
	"resources/codemirror/active-line.js",
	"resources/codemirror/xml.js",
	"resources/codemirror/javascript.js",
	"resources/codemirror/css.js",
	"resources/codemirror/htmlmixed.js",
	"devstudio/devstudio_paragraph.js",
];