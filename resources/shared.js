console.log("PDT: resources/shared.js");

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

//applyContentScripts("paragraphRule");

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
		else if (sinput.includes("-")) {
			var sinputLength = sinput.split("-").length;
			sinput = (sinputLength>3)? sinput.split("-")[sinputLength - 2] + "-" + sinput.split("-")[sinputLength - 1] : sinput.split("-")[sinputLength - 1];
		}
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
		).innerText.startsWith("Home")
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

const getObjectFromStorage = async function (key) {
	return new Promise((resolve, reject) => {
		try {
			chrome.storage.sync.get(key, function (value) {
				resolve(value[key]);
			});
		} catch (ex) {
			reject(ex);
		}
	});
};

class PDT {

	static {

	}

	static init() {
		this.settings = {};
		
		chrome.storage.sync.get(["settings", "siteConfig"], (data) => {
			//this.settings = await getObjectFromLocalStorage("settings");

			this.settings = data.settings;
			if(! this.settings.tracer) this.settings.tracer = {};
			if(! this.settings.clipboard) this.settings.clipboard = {};
			if(! this.settings.devstudio) this.settings.devstudio = {};
			PDT.debug("storage settings load");

			//var siteConfigs = await getObjectFromLocalStorage("siteConfig");

			this.hasConfigForSite = false;
			if (data.siteConfig) {
				for (let i = 0; i < data.siteConfig.length; i++) {
					if (window.location.href.includes(data.siteConfig[i].site)) {
						this.siteConfig = data.siteConfig[i];
						this.hasConfigForSite = true;
						if(this.siteConfig.color) {
							this.siteConfig.color = this.siteConfig.color.replace("#", '');
							if (this.siteConfig.color.length === 3) {
								this.siteConfig.color = this.siteConfig.color.split('').map(function (hex) {
									return hex + hex;
								}).join('');
							}
							if(this.siteConfig.color[0] != "#") 
								this.siteConfig.color = "#" + this.siteConfig.color;
						}
						break;
					}
				}
			}
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

	static isInTracer() {
		return (window.location.href.includes("Tracer"));
	}
	
	static hasConfigForSite;

	static debug(msg) {
		if(this.isDebugEnabled()) console.log(msg);
	}

	static isDigit(n) {
		return !!([!0, !0, !0, !0, !0, !0, !0, !0, !0, !0][n]);
	}

	static contrastTextColor(backgroundColor) {
		//https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
		const getColorLuminance = function(clr) {
			clr = clr / 255;
			if(clr <= 0.03928) 
				return clr / 12.92;
			else
				return ((clr + 0.055) / 1.055) ** 2.4;
		}

		backgroundColor = backgroundColor.replace("#", "");
		var r = parseInt(backgroundColor.substring(0, 2), 16);
		var g = parseInt(backgroundColor.substring(2, 4), 16);
		var b = parseInt(backgroundColor.substring(4, 6), 16);
		var rs = getColorLuminance(r);
		var gs = getColorLuminance(g);
		var bs = getColorLuminance(b);
	  
		var L =  (0.2126 * rs) + (0.7152 * gs) + (0.0722 * bs);

		//https://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
		//const contrastThreshold = 0.0525; 	// 0.0525 is contrast ratio between white and black 
		const contrastThreshold = 0.3; 		// favor more lighter text	 

		return (L > contrastThreshold) ? "#000000" : "#FFFFFF";
	}

	static alterFavicon(forceSmall = false) {
		if(this.hasConfigForSite) {
			if(this.settings.favicon == "large" && this.siteConfig.label && !forceSmall) {
				Tinycon.setOptions({
					width: 16,
					height: 16,
					background: this.siteConfig.color,
					color: this.contrastTextColor(this.siteConfig.color),
					fallback: true
				});
				let faviconLabel = this.siteConfig.label[0];
				if(this.siteConfig.label.length>1) {
					if(PDT.isDigit(this.siteConfig.label.slice(-1)))
						faviconLabel += this.siteConfig.label.slice(-1);
				}      
				Tinycon.setBubble(faviconLabel);
			} else {
				Tinycon.setOptions({
					width: 16,
					height: 3,
					background: this.siteConfig.color,          
					fallback: true
				});
				Tinycon.setBubble(" ");
			}
		}
	}
}

PDT.init();