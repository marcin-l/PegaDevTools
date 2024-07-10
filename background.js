var browser = (browser) ? browser : chrome;

//TODO: modularize
// try {
// 	importScripts('/path/file.js', '/path2/file2.js' /*, and so on */);
//   } catch (e) {
// 	console.error(e);
//}

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
browser.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
	console.debug(request);
	if (request.purpose == "getSettings")
		sendResponse(getSettings());
	if (request.purpose == "getSettingsForSite")
		sendResponse(getSettings(request.site));
	else if (request.purpose == "reloadSettings")
		initSettings();
	else if (request.purpose == "getFrameId")
		sendResponse({ frameId: sender.frameId });
	else if (request.purpose == "appendScript") {
		appendScript(request.appendedScript, sender.tab.id, sender.frameId);
		sendResponse("appending to tab " + sender.tab.id + " frame " + sender.frameId);
	} else if (request.purpose == "reloadContentScripts") {
		if(loadedFrames.has(sender.tab.id + "-" + sender.frameId)) {
			reloadContentScripts(sender.tab.id, sender.frameId, loadedFrames.get(sender.tab.id + "-" + sender.frameId));
			sendResponse("reloading content scripts " + sender.tab.id + " frame " + sender.frameId);
		} else {
			console.log(sender.tab.id + "-" + sender.frameId + " not found in loadedFrames");
		}
	} else if (request.purpose == "injectScript") {
		injectScript(request.injectedScript, sender.tab.id, sender.frameId);
		sendResponse("injecting " + request.injectedScript + " to tab " + sender.tab.id + " frame " + sender.frameId);
	} else if (request.purpose == "loaded") {
		if(request.url != "about:blank" && !loadedFrames.has(sender.tab.id + "-" + sender.frameId)) {
			loadedFrames.set(sender.tab.id + "-" + sender.frameId, request.url);
			console.log("Registered " + sender.tab.id + "-" + sender.frameId + ": " + request.url);
		} 
		// else {
		// 	if(loadedFrames.has(sender.tab.id + "-" + sender.frameId) && (request.url.includes("DeleteCheckOut") || request.url.includes("ReloadHarness"))) {
		// 		reloadContentScripts(sender.tab.id, sender.frameId, loadedFrames.get(sender.tab.id + "-" + sender.frameId));
		// 		sendResponse("Reloading content scripts tab " + sender.tab.id + " frame " + sender.frameId);
		// 	} else {
		// 		console.log(sender.tab.id + "-" + sender.frameId + " not found in loadedFrames");
		// 	}
		// }

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
//TODO: investigate Long-lived connections https://developer.chrome.com/docs/extensions/develop/concepts/messaging#connect
function tracerIsRunning() {
	let counter = 0, heartbeat, hasHeartbeat = true;
	document.querySelector("div.create-case span").insertAdjacentHTML("afterend", "<div id='PDTTracerIndicator'><button id='PDTDevTracerPlayPause' type='button'>ıı</button><div id='PDTTracerState' class='Header_nav margin-1x'>Tracer&nbsp;active!</div></div>");
	let tracerIndicator	= document.querySelector("div#PDTTracerIndicator");
	document.querySelector("button#PDTDevTracerPlayPause").addEventListener("click", function(event) { browser.runtime.sendMessage({ purpose: "tracerStop"}) });
	
	let _titleTimerId = setInterval(function () {
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

function matchToRegEx(match) {
	let regEx = match.replace(/[{}()\[\]\\.+?^$|]/g, "\\$&").replace(/\*/g, '.*?');
	return regEx;
}

const injectScriptsToIframe = (tabId, frameId, scriptList) => {
	browser.scripting.executeScript({
		files: scriptList,
		target: { tabId: tabId, frameIds: [frameId] },
		world: "MAIN",
	});
};
	// scriptList.forEach((script) => {
	//   console.log("PDT executeScript tabId: " + tabId + ", frameId: " + frameId + ": " + `${script}`);
	//   browser.scripting.executeScript({
	//     files: [injectedScript],
	//     target: { tabId: tabId, frameIds: [frameId] },
	//     world: "MAIN"

function initSettings() {
	browser.storage.sync.get(["settings", "siteConfig"], (data) => {
		settings = data.settings;
		if(typeof settings === "undefined") settings = {};
		if(typeof settings.tracer === "undefined") settings.tracer = {};
		if(typeof settings.clipboard === "undefined") settings.clipboard = {};
		if(typeof settings.devstudio === "undefined") settings.devstudio = {};
		settings.siteConfig = new Map();

		if (data.siteConfig) {
			for (let i = 0; i < data.siteConfig.length; i++) {
				if(data.siteConfig[i].color) {
					data.siteConfig[i].color = data.siteConfig[i].color.replace("#", '');
					if (data.siteConfig[i].color.length === 3) {
						data.siteConfig[i].color = data.siteConfig[i].color.split('').map((hex) => {
							return hex + hex;
						}).join('');
					}
					if(data.siteConfig[i].color[0] != "#") 
						data.siteConfig[i].color = "#" + data.siteConfig[i].color;
				}

				siteConfig.set(data.siteConfig[i].site, data.siteConfig[i]);
			}
		}
	});
}

//listen to browser storage change
browser.storage.onChanged.addListener((changes, area) => {
	if (area === "sync" && changes.settings) {
		settings = changes.settings.newValue;
		console.log("PDT Service Worker: settings updated");
	}
});

function getSettings(site) {
	let settingsForSite = settings;		
	if(site && siteConfig.has(site))
		settingsForSite.siteConfig = siteConfig.get(site);
	else
		settingsForSite.siteConfig = {};

	return settingsForSite;
}

let arrDevTabs = new Map(), arrTracerTabs = new Map(), loadedFrames = new Map(), processedFrames = new Map(), settings = {}, siteConfig = new Map();

async function setup() {
	browser.runtime.onInstalled.addListener(async () => {
		let url = browser.runtime.getURL("settings.html");
		await browser.tabs.create({ url });
	});

	// browser.webRequest.onCompleted.addListener(
	// 	function(details) {
	// 		console.debug(details);
	// 		if(details.frameType == "sub_frame" && details.frameId && loadedFrames.has(details.tabId + "-" + details.frameId)) 
	// 			pingFrame(details.tabId, details.frameId);
	// 	},
	// 	{urls: ["<all_urls>"]},
	// 	["responseHeaders"]
	// );

	// initSettings();

	// //FEATURE: toggle certain options from extension context menu
	// browser.contextMenus.create({
	// 	title: "Toggle",
	// 	id: "toggleMenu",
	// 	"contexts": ["all"]
	// });

	// browser.contextMenus.create({
	// 	title: "Hide tab close button",
	// 	"contexts": ["all"],
	// 	parentId: "toggleMenu"
	// });

};
	//   });

	//   browser.tabs.executeScript(tabId, {
	//     file: `${script}`,
	//     runAt: 'document_end',
	//     frameId: frameId
	//     //If the script injection fails (without the tab permission and so on) and is not checked in the callback` runtime.lastError `，
	//     //It's a mistake. There is no other complicated logic in this example. You don't need to record the tab of successful injection. You can fool it like this.
	//   }, () => void browser.runtime.lastError);
	// });


// async function setup() {
// 	browser.runtime.onInstalled.addListener(async () => {
// 		let url = browser.runtime.getURL("settings.html");
// 		await browser.tabs.create({ url });
// 	});
// }

//setup();
initSettings();