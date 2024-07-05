/* tracer - top menu iframe */

function isTracerActive() {
	return (
		document.getElementById("Pause") &&
		document.getElementById("Pause").innerText == "Pause"
	);
}
var titleTimerId;
var counter = 0;

async function backgroundNotify(state) {
	if (PDT.settings.debug) {
		browser.runtime.sendMessage({ purpose: "tracerState", tracerIsOn: state });
	}
}

async function backgroundHeartbeat() {
	if (PDT.settings.debug) {
		browser.runtime.sendMessage({ purpose: "tracerHeartbeat" });
		console.log("PDT sending heartbeat " + Math.floor(Date.now() / 1000));
	}
}

async function updateCounts() {
	updateMessageCount(getMessagesList().length);
	updateErrorCount(getErrorList().length);
}

async function resetCounts() {
	updateMessageCount();
	updateErrorCount();
}

function setTitle() {
	if (isTracerActive()) {
		parent.document.title = "ıı Tracer Off";
		clearInterval(titleTimerId);
		backgroundNotify(false);
		updateCounts();
	} else {
		parent.document.title = "Tracer Active!";
		backgroundHeartbeat();
		backgroundNotify(true);
		resetCounts();

		titleTimerId = setInterval(function () {
			parent.document.title = "►" + parent.document.title;
			counter++;
			if (counter % 2 == 0) {
				parent.document.title = "Tracer Active!";
			}
			backgroundHeartbeat();
		}, 1000);
	}
}

var errorIndex = 0,
	messageIndex = 0,
	accessDeniedIndex;
var errorList = [],
	messagesList = [],
	accessDeniedList = [];

function getErrorList() {
	return window.parent.frames[1].document.querySelectorAll(
		'td[title="FAIL"], td[title="Exception"], tr.eventTableAlertTrace td.eventElementData'
	);
}

function getMessagesList() {
	return window.parent.frames[1].document.querySelectorAll(
		'td[bgcolor="orange"], td[title="WARN"]'
	);
}

function getAccessDeniedList() {
	return window.parent.frames[1].document.querySelectorAll(
		'td[title="Access Denied"]'
	);
}

function updateErrorCount(count, index) {
	let newTextContent = "Errors";
	if (!(count === undefined)) {
		newTextContent = "Errors" + String.fromCharCode(160);
		if (index) newTextContent += "" + index + "/" + count;
		else newTextContent += "" + count;
	}
	document.querySelector("button#btnPDTErrors").textContent = newTextContent;
}

function updateMessageCount(count, index) {
	let newTextContent = "Warnings";
	if (count !== undefined) {
		newTextContent = "Warnings" + String.fromCharCode(160);
		if (index) newTextContent += "" + index + "/" + count;
		else newTextContent += "" + count;
	}
	document.querySelector("button#btnPDTMessages").textContent = newTextContent;
}

function updateAccessDeniedCount(count) {
	document.querySelector("button#btnPDTAccessDenied").textContent =
		" AccessDeny(" + count + ")";
}

//TODO: convert to use PDT.settings
function siteConfigCallback(siteConfig, _globalConfig) {
	if (!PDT.isTracerEnabled()) {
		console.log("PDT tracer disabled");
	} else {
		console.log("PDT tracer");
		messageServiceWorker("registerTracer"); //register with Service Worker

		if (siteConfig?.label) {
			let headerButtonsElement = document.querySelector("table.tracertop tr");
			if (headerButtonsElement) {
				headerButtonsElement.insertAdjacentHTML(
					"beforeend",
					"<td style='width:30px;font-size:11pt; color: white; text-shadow: black 0px 0px 6px;background-color:#" +
						siteConfig.color.replace("#", "") +
						";border:2px solid;border-top-style:none; border-right-style:none;margin: 0 0 4px 0;font-weight: bold;border-color:#" +
						siteConfig.color.replace("#", "") +
						"; padding:6px'>" +
						siteConfig.label +
						"</ td>"
				);
			}

			if (siteConfig.useColorTop) {
				document.querySelector("table.tracertop").style.cssText =
					"border-top: #" + siteConfig.color.replace("#", "") + " 2px solid";
			}
		}
		$("#Pause").click(function () {
			setTitle();
		});

		$("#ClearEvents").click(function () {
			resetCounts();
		});

		//TODO: get rid of jQuery, use fetch API
		$.get(browser.runtime.getURL("tracer/tracer_button.html"), function (data) {
			//add buttons from html
			$("table.tracertop table tr").eq(2).prepend(data);

			waitUntilRenderTracerButtons();
		});
	}
}

function addEventHandlers() {
	document.querySelector("button#btnPDTErrors");

	//setTitle();

	//TODO: !!!!!!!
	document.querySelector("button#btnPDTErrors").oncontextmenu = function () {
		let offset = this.getBoundingClientRect().left;
		let errorListDropdown = window.parent.frames[1].document.querySelector(
			"div.dropdown-content"
		);
		if (errorListDropdown) {
			Array.prototype.forEach.call(
				errorListDropdown.querySelectorAll("a"),
				function (node) {
					node.parentNode.removeChild(node);
				}
			);
			errorListDropdown.style.display = "block";
			errorListDropdown.style.left = offset;

			for (let errorResult in getErrorList()) {
				let newElem = document.createElement("a");
				newElem.textContent = errorResult.parent.querySelector("td#eventLineNumber").title;
				errorListDropdown.appendChild(newElem);
			}
			let elem = document.createElement("a");
			elem.textContent = "Close";
			elem.onclick = function () {
				document.querySelector("div.dropdown-content").style.display = "none";
			};
			return false;
		} else console.log("[PDT] tracer dropdown not found");
	};

	/* #region Errors buttons */
	document.querySelector("button#btnPDTErrors").onclick = function () {
		errorList = getErrorList();
		if (errorList.length) {
			errorList[errorList.length - 1].scrollIntoView(false);
		}
		updateErrorCount(errorList.length);
		errorIndex = 0;
	};

	document.querySelector("button#btnPDTErrorsPrev").onclick = function () {
		errorList = getErrorList();
		if (errorList.length) {
			errorIndex += 1;
			if (errorIndex >= errorList.length) {
				errorIndex = 0;
			}
			errorList[errorIndex].scrollIntoView(false, { behavior: "smooth" });
			updateErrorCount(errorList.length, errorIndex + 1);
		} else {
			updateErrorCount(errorList.length);
		}
	};

	document.querySelector("button#btnPDTErrorsNext").onclick = function () {
		errorList = getErrorList();
		if (errorList.length) {
			errorIndex -= 1;
			if (errorIndex < 0) {
				errorIndex = errorList.length - 1;
			}
			errorList[errorIndex].scrollIntoView(false, { behavior: "smooth" });
			updateErrorCount(errorList.length, errorIndex + 1);
		} else {
			updateErrorCount(errorList.length);
		}
	};
	/* #endregion */

	/* #region Messages buttons */
	document.querySelector("button#btnPDTMessages").onclick = function () {
		messagesList = getMessagesList();
		if (messagesList.length) {
			messagesList[messagesList.length - 1].scrollIntoView(false);
		}
		updateMessageCount(messagesList.length);
		messageIndex = 0;
	};

	document.querySelector("button#btnPDTMessagesPrev").onclick = function () {
		messagesList = getMessagesList();
		if (messagesList.length) {
			messageIndex += 1;
			if (messageIndex >= messagesList.length) {
				messageIndex = 0;
			}
			messagesList[messageIndex].scrollIntoView(false, { behavior: "smooth" });
			updateMessageCount(messagesList.length, messageIndex + 1);
		} else updateMessageCount(messagesList.length);
	};

	document.querySelector("button#btnPDTMessagesNext").onclick = function () {
		messagesList = getMessagesList();
		if (messagesList.length) {
			messageIndex -= 1;
			if (messageIndex < 0) {
				messageIndex = messagesList.length - 1;
			}
			messagesList[messageIndex].scrollIntoView(false, { behavior: "smooth" });
			updateMessageCount(messagesList.length, messageIndex + 1);
		} else updateMessageCount(messagesList.length);
	};
	/* #endregion */
}

//make sure buttons are part of the DOM before adding event handlers
//TODO: use arrive.js
function waitUntilRenderTracerButtons() {
	let expectedElement = document.querySelector("button#btnPDTErrors");
	if (expectedElement) {
		addEventHandlers();
	} else {
		tries = tries + 1;
		console.log(tries);
		//if (tries > 10) return;
		setTimeout(() => {
			waitUntilRenderTracerButtons();
		}, 500);
	}
}

var tries = 0;

//make sure we are in the right frame, script can be loaded with tracer page popup
if(document.querySelector("table.tracertop")) {
	siteConfig(siteConfigCallback);
}

PDT.alterFavicon();

//TODO:
//displayPage = new Function('pageXML','pageName','pagePropertyName', displayPage.toString().match(/{([\s\S]*)}/)[1].replace('window.open(strURL,strForm,"status=yes,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes"  + strFeatures)', "window.open(strURL,'_blank')"));
//TODO:  Access Deny list
//window.parent.frames[1].document.querySelectorAll('td[title="Access Denied"]')