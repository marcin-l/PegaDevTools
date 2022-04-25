console.log("PDT: shared.js");

function getFrameId() {
	chrome.runtime.sendMessage({ purpose: "getFrameId" }, function (response) {
		console.log("FrameId: " + response.frameId);
		return response.frameId;
	});
}

function applyContentScripts(purpose) {
	chrome.runtime.sendMessage(
		{ purpose: purpose, tabId: getCurrentTabId() },
		function (response) {
			console.log(response);
		}
	);
}

//applyContentScripts("paragraphRule");

const injectScriptsToIframe = (tabId, frameId, scriptList) => {
	scriptList.forEach((script) => {
		console.log(
			"PDT executeScript tabId: " +
				tabId +
				", frameId: " +
				frameId +
				": " +
				`${script}`
		);
		chrome.tabs.executeScript(
			tabId,
			{
				file: `${script}`,
				runAt: "document_end",
				frameId: frameId,
				//If the script injection fails (without the tab permission and so on) and is not checked in the callback` runtime.lastError `，
				//It's a mistake. There is no other complicated logic in this example. You don't need to record the tab of successful injection. You can fool it like this.
			},
			() => void chrome.runtime.lastError
		);
	});
};

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

//injectScriptsToIframe(null, getFrameId(), paragraphScriptList);

console.log("PDT: resources/shared.js");

//TODO: deprecated?
window.browser = (function () {
	return window.msBrowser || window.browser || window.chrome;
})();


const DEBUG = false;

if (
	$(
		'body[class^="channels-express"] div[data-node-id="pzRuntimeToolsTopBar"] div.layout-content-pz-inline-middle'
	).length
) {
	//change order to match Dev Studio
	var tracerRef = $(
		'div[data-node-id="pzRuntimeToolsTopBar"] div.layout-content-pz-inline-middle div:has(i.pi-tracer)'
	);
	$(
		'div[data-node-id="pzRuntimeToolsTopBar"] div.layout-content-pz-inline-middle div:has(i.pi-clipboard)'
	).before(tracerRef);

	//add text
	$(
		'div[data-node-id="pzRuntimeToolsTopBar"] div.layout-content-pz-inline-middle div:has(i.pi-tracer) button'
	).append("Tracer");
	$(
		'div[data-node-id="pzRuntimeToolsTopBar"] div.layout-content-pz-inline-middle div:has(i.pi-clipboard) button'
	).append("Clipboard");
	$(
		'div[data-node-id="pzRuntimeToolsTopBar"] div.layout-content-pz-inline-middle div:has(i.pi-inspect) button'
	).append("Live UI");
}

var copyToClipboard = function copyToClipboard(textContent) {
	// create hidden text element, if it doesn't already exist
	var targetId = "_hiddenCopyText_";
	var target = document.createElement("textarea");
	target.style.position = "absolute";
	target.style.left = "-9999px";
	target.style.top = "0";
	target.id = targetId;
	document.body.appendChild(target);
	target.textContent = textContent;

	// select the content
	var currentFocus = document.activeElement;
	target.focus();
	target.setSelectionRange(0, target.value.length);

	// copy the selection
	var succeed;
	try {
		succeed = document.execCommand("copy");
	} catch (e) {
		succeed = false;
	}
	// restore original focus
	if (currentFocus && typeof currentFocus.focus === "function") {
		currentFocus.focus();
	}

	target.textContent = "";
	return succeed;
};

function messageServiceWorker(purpose) {
	chrome.runtime.sendMessage(
		{ purpose: purpose }
	); 
}

//TODO: not working as of v3, use injectScript with separate files in js folder instead
function appendScript(appendedScript) {
	if(PDT.isDebugEnabled)
		console.log("PDT: appendScript: " + appendedScript);
	chrome.runtime.sendMessage(
		{ purpose: "appendScript", appendedScript: appendedScript },
		function (response) {
			console.log(response);
		}
	); 
}

function injectScript(aBasePath, aScriptURL) {
	chrome.runtime.sendMessage(
		{ purpose: "injectScript", injectedScript: aBasePath+aScriptURL },
		function (response) {
			console.log(response);
		}
	); 
}
//inject script to toggle sidebar using keyboard shortcut
function injectSidebarToggle() {
	injectScript("/js/", "sidebarToggle.js");
}

//inject script to close tab using keyboard shortcut
function injectCloseShortcut() {
	injectScript("/js/", "closeShortcut.js");
}

// deprecated?
function executeScript(injectedCode) {
	var scriptEl = document.createElement("script");
	scriptEl.appendChild(document.createTextNode("(" + injectedCode + ")();"));
	(document.body || document.head || document.documentElement).appendChild(
		scriptEl
	);
}

function extractClassName(sinput, getFull) {
	if (sinput) {
		var idx = sinput.indexOf("(");
		sinput = sinput.substring(idx != -1 ? idx + 1 : 0);
		if (sinput[sinput.length - 1] === ")")
			sinput = sinput.substring(0, sinput.length - 1);
		if (getFull) return sinput;
		if (sinput.includes("Work-")) sinput = sinput.split("Work-")[1];
		else if (sinput.includes("Assign-")) sinput = sinput.split("Assign-")[1];
		else if (sinput.includes("-")) sinput = sinput.split("-")[sinput.split("-").length - 1];
		return sinput;
	}
}

var showElem = function (elem) {
	//show an element
	elem.style.display = "block";
};

var hideElem = function (elem) {
	//hide an element
	elem.style.display = "none";
};

var toggleElem = function (elem) {
	//toggle element visibility
	if (window.getComputedStyle(elem).display === "block") {
		// if the element is visible, hide it
		hide(elem);
		return;
	}
	show(elem); //otherwise show it
};

function injectStyles(rule) {
	$("<div />", {
		//html: '&shy;<style>' + rule + '</style>'
		html: "<style>" + rule + "</style>",
	}).appendTo("body");
}

function replaceInnerHTML(elem, html) {
	const parser = new DOMParser();
	const parsed = parser.parseFromString(html, `text/html`);
	elem.appendChild(parsed);
}

function siteConfig(callback) {
	//get label and color config
	chrome.storage.sync.get(["siteConfig", "settings"], (data) => {
		console.log(data);
		//find config for current url
		var configForSiteFound = false;
		if (data.siteConfig) {
			for (let i = 0; i < data.siteConfig.length; i++) {
				if (window.location.href.includes(data.siteConfig[i].site)) {
					callback(data.siteConfig[i], data);
					configForSiteFound = true;
					break;
				}
			}
		}
		if (!configForSiteFound) callback(null, data);
		// $(data.siteConfig).each(function (index, site) {
		//     if (window.location.href.includes(site.site)) {
		//         callback(site, data);
		//     }
		// });
	});
}

//TODO: ugly, try not to use it
function sleep(milliseconds) {
	var start = new Date().getTime();
	while (new Date() < start + milliseconds) {}
	return 0;
}

function isInDevStudio() {
	//NOTE: ugly but works
	return (
		document.querySelector(
			"span#TABANCHOR span.textIn, span#TABANCHOR[tabtitle='Home']"
		) &&
		document.querySelector(
			"span#TABANCHOR span.textIn, span#TABANCHOR[tabtitle='Home']"
		).innerText == "Home"
	);
	//TODO: get Pega api object
	// if(pega.desktop.support.isInDesignerDesktop)
	//     return pega.desktop.support.isInDesignerDesktop();
}

function injectRuleExport() {
	var selection = document.querySelector("div[data-node-id='pzRuleFormRuleset'] div.primary-navigation-links");
	if(selection) {
		selection.insertAdjacentHTML("beforeend", "<a onclick='copyRuleTableContent()'>Export</a>");
		injectScript("/js/", "copyRuleTableContent.js");
	}
}

class PDT {
	static {
		this.settings = {};
		chrome.storage.sync.get(["settings"], (data) => {
			this.settings = data.settings;
			if(! this.settings) this.settings = {};
			if(! this.settings.tracer) this.settings.tracer = {};
			if(! this.settings.clipboard) this.settings.clipboard = {};
			if(! this.settings.devstudio) this.settings.devstudio = {};
		});
	}

	save() {
		chrome.storage.sync.set({ settings: this.settings });
	}

	get(key) {
		return this.settings[key];
	}

	static isTracerEnabled() {
		return !(this.settings.tracer.disabled);
	}

	static isClipboardEnabled() {
		return !(this.settings.clipboard.disabled);
	}

	static isDevstudioEnabled() {
		return !(this.settings.devstudio.disabled);
	}

	static isDebugEnabled() {
		return this.settings.debug;
	}

	static debug(msg) {
		if(this.isDebugEnabled()) console.log(msg);
	}
}