console.log("PDT: resources/shared.js");

browser = window.browser || window.chrome;

// //TODO: deprecated?
// window.browser = (function () {
// 	return window.msBrowser || window.browser || window.browser;
// })();

class PDT {
	static {
	}

	static init() {
		this.settings = {};
		
		browser.storage.sync.get(["settings", "siteConfig"], (data) => {
			//this.settings = await getObjectFromLocalStorage("settings");

			this.settings = data.settings;
			if(typeof this.settings === "undefined") this.settings = {};
			if(typeof this.settings.tracer === "undefined") this.settings.tracer = {};
			if(typeof this.settings.clipboard === "undefined") this.settings.clipboard = {};
			if(typeof this.settings.devstudio === "undefined") this.settings.devstudio = {};

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
								this.siteConfig.color = this.siteConfig.color.split('').map((hex) => {
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
		browser.storage.sync.set({ settings: this.settings });
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
		return !(this.settings.devstudio && this.settings.devstudio.disabled);
	}

	static isAgilestudioEnabled() {
		return (this.settings.agilestudio && this.settings.agilestudio.enabled);
	}

	static isDeploymentManagerEnabled() {
		return (this.settings.deploymentmanager && this.settings.deploymentmanager.enabled);
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

	static log(msg) {
		console.log(msg);
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
		let r = parseInt(backgroundColor.substring(0, 2), 16);
		let g = parseInt(backgroundColor.substring(2, 4), 16);
		let b = parseInt(backgroundColor.substring(4, 6), 16);
		let rs = getColorLuminance(r);
		let gs = getColorLuminance(g);
		let bs = getColorLuminance(b);
	  
		let L =  (0.2126 * rs) + (0.7152 * gs) + (0.0722 * bs);

		//https://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
		//const contrastThreshold = 0.0525; 	// 0.0525 is contrast ratio between white and black 
		const contrastThreshold = 0.3; 		// favor more lighter text	 

		return (L > contrastThreshold) ? "#000000" : "#FFFFFF";
	}

	static alterFavicon(forceSmall = false, forceLargeLabel = "", forceColor = "") {
		//favicon fallback
		let favicon = document.querySelector("link[rel~='icon']");
		if (!favicon) {
			favicon = document.createElement('link');
			favicon.rel = 'icon';
			favicon.href = "images/pzPegaIcon.ico";
			favicon.name = "faviconFallback"
			document.getElementsByTagName('head')[0].appendChild(favicon);
		}

		if(this.hasConfigForSite || forceColor) {
			if(forceLargeLabel || (this.settings.favicon == "large" && this.siteConfig.label && !forceSmall)) {
				Tinycon.setOptions({
					width: 16,
					height: 16,
					background: (forceColor || this.siteConfig.color),
					color: this.contrastTextColor(forceColor || this.siteConfig.color),
					fallback: true
				});
				let faviconLabel = forceLargeLabel;
				if(!faviconLabel) {
					faviconLabel = this.siteConfig.label[0];
					if(this.siteConfig.label.length>1) {
						if(PDT.isDigit(this.siteConfig.label.slice(-1)))
							faviconLabel += this.siteConfig.label.slice(-1);
					}
					if(faviconLabel.length == 1)
						faviconLabel += " ";
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

if(typeof PDT.settings ===  "undefined")
	PDT.init();

function getFrameId() {
	browser.runtime.sendMessage({ purpose: "getFrameId" }, function (response) {
		console.log("FrameId: " + response.frameId);
		return response.frameId;
	});
}

// function applyContentScripts(purpose) {
// 	browser.runtime.sendMessage(
// 		{ purpose: purpose, tabId: getCurrentTabId() },
// 		function (response) {
// 			console.log(response);
// 		}
// 	);
// }

const injectScriptsToIframe = (tabId, frameId, scriptList) => {
	scriptList.forEach((script) => {
		console.log(
			"PDT executeScript tabId: " + tabId +
			", frameId: " + frameId +
			": " + `${script}`
		);
		browser.tabs.executeScript(
			tabId,
			{
				file: `${script}`,
				runAt: "document_end",
				frameId: frameId,
				//If the script injection fails (without the tab permission and so on) and is not checked in the callback` runtime.lastError `，
				//It's a mistake. There is no other complicated logic in this example. You don't need to record the tab of successful injection. You can fool it like this.
			},
			() => void browser.runtime.lastError
		);
	});
};

const DEBUG = false;

if ($('body[class^="channels-express"] div[data-node-id="pzRuntimeToolsTopBar"] div.layout-content-pz-inline-middle').length) {
	//change order to match Dev Studio
	let tracerRef = $(
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
	let targetId = "_hiddenCopyText_";
	let target = document.createElement("textarea");
	target.style.position = "absolute";
	target.style.left = "-9999px";
	target.style.top = "0";
	target.id = targetId;
	document.body.appendChild(target);
	target.textContent = textContent;

	// select the content
	let currentFocus = document.activeElement;
	target.focus();
	target.setSelectionRange(0, target.value.length);

	// copy the selection
	let succeed;
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
	browser.runtime.sendMessage(
		{ purpose: purpose }
	); 
}

//TODO: not working as of v3, use injectScript with separate files in js folder instead
function appendScript(appendedScript) {
	if(PDT.isDebugEnabled)
		console.log("PDT: appendScript: " + appendedScript);
	browser.runtime.sendMessage(
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
	let scriptEl = document.createElement("script");
	scriptEl.appendChild(document.createTextNode("(" + injectedCode + ")();"));
	(document.body || document.head || document.documentElement).appendChild(
		scriptEl
	);
}

function extractClassName(sInput, getFull) {
	if (sInput) {
		let idx = sInput.indexOf("(");
		sInput = sInput.substring(idx != -1 ? idx + 1 : 0);
		if (sInput[sInput.length - 1] === ")")
			sInput = sInput.substring(0, sInput.length - 1);
		if (getFull) return sInput;
		if (sInput.includes("Work-")) sInput = sInput.split("Work-")[1];
		else if (sInput.includes("Assign-")) sInput = sInput.split("Assign-")[1];
		else if (sInput.includes("-")) {
			let sInputLength = sInput.split("-").length;
			sInput = (sInputLength>3)? sInput.split("-")[sInputLength - 2] + "-" + sInput.split("-")[sInputLength - 1] : sInput.split("-")[sInputLength - 1];
		}
		return sInput;
	}
}

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
	browser.storage.sync.get(["siteConfig", "settings"], (data) => {
		console.log(data);
		//find config for current url
		let configForSiteFound = false;
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
	let start = new Date().getTime();
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
	let selection = document.querySelector("div[data-node-id='pzRuleFormRuleset'] div.primary-navigation-links");
	if(selection) {
		selection.insertAdjacentHTML("beforeend", "<a onclick='copyRuleTableContent()'>Export</a>");
		injectScript("/js/", "copyRuleTableContent.js");
	}
}

const getObjectFromStorage = async function (key) {
	return new Promise((resolve, reject) => {
		try {
			browser.storage.sync.get(key, function (value) {
				resolve(value[key]);
			});
		} catch (ex) {
			reject(ex);
		}
	});
};
