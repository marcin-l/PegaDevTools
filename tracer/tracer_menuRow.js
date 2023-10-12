/* tracer - top menu iframe */
document.arrive("body#main", { onceOnly: true, existing: true}, () => {

	console.log("[PDT] tracer/tracer_menuRow.js");

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
	accessDeniedIndex,
	bookmarkIndex = 1;
var errorList = [],
	messagesList = [],
	accessDeniedList = [],
	bookmarkList = [];

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

	function getBookmarksList() {
		return window.parent.frames[1].document.querySelectorAll(
			'td[data-PDTbookmark]'
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

	function updateButtonCount(buttonElement, text, count, index) {
		if (count !== undefined) {
			text = text + String.fromCharCode(160);
			if (index) text += "" + index + "/" + count;
			else text += "" + count;
		}
		buttonElement.textContent = text;
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

			if (siteConfig && siteConfig.label) {
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

			// fetch API
			// fetch(browser.runtime.getURL("tracer/tracer_buttonBookmarks.html")).then(t => t.text()).then(data => {                    
			// 	let prevButton = document.querySelector("div.btnPDTGroup");
			// 	if(prevButton) {
			// 		prevButton.insertAdjacentHTML("beforebegin", data)
			// 	}
			// });
		}
	}
	function addEventHandlers() {

		function navigateTo(itemList, nextOrPrev, currentIndex, text, clickedButton) {
			let buttonElement = (nextOrPrev === "next" ? clickedButton.previousElementSibling : clickedButton.nextElementSibling);
			if (itemList.length) {
				currentIndex += (nextOrPrev === "next" ? -1 : 1);
				// if(nextOrPrev === "next")
				// 	currentIndex -= 1;
				// else
				// 	currentIndex += 1;				
				if (currentIndex < 0) {
					currentIndex = itemList.length - 1;
				}
				itemList[currentIndex].scrollIntoView(false, { behavior: "smooth" });
				updateButtonCount(buttonElement, text, itemList.length, currentIndex + 1);
			} else updateButtonCount(buttonElement, text, itemList.length);
			return currentIndex;
		}

		/* #region Errors buttons */

		//FEATURE: Errors button context menu
		document.querySelector("button#btnPDTErrors").oncontextmenu = (e) => {
			let errorListDropdown = window.parent.frames[1].document.querySelector("div.PDTdropdown.errors");
			return addDropdownHandler(errorListDropdown, getErrorList(), e.clientX - e.offsetX);
		};

		//FEATURE: Go to first error instance
		document.querySelector("button#btnPDTErrors").onclick = function () {
			errorList = getErrorList();
			if (errorList.length) {
				errorList[errorList.length - 1].scrollIntoView(false);
			}
			updateErrorCount(errorList.length);
			errorIndex = 0;
		};

		//FEATURE: Go to previous error
		document.querySelector("button#btnPDTErrorsPrev").onclick = function () {
			// errorList = getErrorList();
			// if (errorList.length) {
			// 	errorIndex += 1;
			// 	if (errorIndex >= errorList.length) {
			// 		errorIndex = 0;
			// 	}
			// 	errorList[errorIndex].scrollIntoView(false, { behavior: "smooth" });
			// 	updateErrorCount(errorList.length, errorIndex + 1);
			// } else {
			// 	updateErrorCount(errorList.length);
			// }
			errorIndex = navigateTo(getErrorList(), "prev", errorIndex, "Errors", this);
		};

		//FEATURE: Go to next error
		document.querySelector("button#btnPDTErrorsNext").onclick = function () {
			// errorList = getErrorList();
			// if (errorList.length) {
			// 	errorIndex -= 1;
			// 	if (errorIndex < 0) {
			// 		errorIndex = errorList.length - 1;
			// 	}
			// 	errorList[errorIndex].scrollIntoView(false, { behavior: "smooth" });
			// 	updateErrorCount(errorList.length, errorIndex + 1);
			// } else {
			// 	updateErrorCount(errorList.length);
			// }
			errorIndex = navigateTo(getErrorList(), "next", errorIndex, "Errors", this);
		};
		/* #endregion */

		/* #region Messages buttons */

		//FEATURE: Warnings button context menu
		document.querySelector("button#btnPDTMessages").oncontextmenu = (e) => {
			let messagesListDropdown = window.parent.frames[1].document.querySelector("div.PDTdropdown.warnings");
			return addDropdownHandler(messagesListDropdown, getMessagesList(), e.clientX - e.offsetX);
		};

		//FEATURE: Go to first warning/message instance
		document.querySelector("button#btnPDTMessages").onclick = function () {
			messagesList = getMessagesList();
			if (messagesList.length) {
				messagesList[messagesList.length - 1].scrollIntoView(false);
			}
			updateMessageCount(messagesList.length);
			messageIndex = 0;
		};

		//FEATURE: Go to previous warning
		document.querySelector("button#btnPDTMessagesPrev").onclick = function () {
			// messagesList = getMessagesList();
			// if (messagesList.length) {
			// 	messageIndex += 1;
			// 	if (messageIndex >= messagesList.length) {
			// 		messageIndex = 0;
			// 	}
			// 	messagesList[messageIndex].scrollIntoView(false, { behavior: "smooth" });
			// 	updateMessageCount(messagesList.length, messageIndex + 1);
			// } else updateMessageCount(messagesList.length);
			messageIndex = navigateTo(getMessagesList(), "prev", messageIndex, "Warnings", this);
		};

		//FEATURE: Go to next warning
		document.querySelector("button#btnPDTMessagesNext").onclick = function () {
			// messagesList = getMessagesList();
			// if (messagesList.length) {
			// 	messageIndex -= 1;
			// 	if (messageIndex < 0) {
			// 		messageIndex = messagesList.length - 1;
			// 	}
			// 	messagesList[messageIndex].scrollIntoView(false, { behavior: "smooth" });
			// 	updateMessageCount(messagesList.length, messageIndex + 1);
			// } else updateMessageCount(messagesList.length);
			messageIndex = navigateTo(getMessagesList(), "next", messageIndex, "Warnings", this);
		};
		/* #endregion */

		/* #region Bookmarks buttons */

		//FEATURE: Bookmarks button context menu
		document.querySelector("button#btnPDTBookmarks").oncontextmenu = (e) => {
			let errorListDropdown = window.parent.frames[1].document.querySelector("div.PDTdropdown.bookmarks");
			return addDropdownHandler(errorListDropdown, getBookmarksList(), e.clientX - e.offsetX);
		};

		//FEATURE: Go to first bookmark instance
		document.querySelector("button#btnPDTBookmarks").onclick = function () {
			bookmarkList = getBookmarksList();
			if (bookmarkList.length) {
				bookmarkList[bookmarkList.length - 1].scrollIntoView(false);
			}
			updateButtonCount(this, "Bookmarks", bookmarkList.length);
			bookmarkIndex = 0;
		};

		//FEATURE: Go to previous bookmark
		document.querySelector("button#btnPDTBookmarksPrev").onclick = function () {
			// bookmarkList = getBookmarksList();
			// if (bookmarkList.length) {
			// 	bookmarkIndex += 1;
			// 	if (bookmarkIndex >= bookmarkList.length) {
			// 		bookmarkIndex = 0;
			// 	}
			// 	bookmarkList[bookmarkIndex].scrollIntoView(false, { behavior: "smooth" });
			// 	updateButtonCount(this.nextElementSibling, "Bookmarks", bookmarkList.length, bookmarkIndex + 1);
			// } else updateButtonCount(this.nextElementSibling, "Bookmarks", bookmarkList.length);
			bookmarkIndex = navigateTo(getBookmarksList(), "prev", bookmarkIndex, "Bookmarks", this);
		};

		//FEATURE: Go to next bookmark
		document.querySelector("button#btnPDTBookmarksNext").onclick = function () {
			// bookmarkList = getBookmarksList();
			// if (bookmarkList.length) {
			// 	bookmarkIndex -= 1;
			// 	if (bookmarkIndex < 0) {
			// 		bookmarkIndex = bookmarkList.length - 1;
			// 	}
			// 	bookmarkList[bookmarkIndex].scrollIntoView(false, { behavior: "smooth" });
			// 	updateButtonCount(this.previousElementSibling, "Bookmarks", bookmarkList.length, bookmarkIndex + 1);
			// } else updateButtonCount(this.previousElementSibling, "Bookmarks", bookmarkList.length);
			bookmarkIndex = navigateTo(getBookmarksList(), "next", bookmarkIndex, "Bookmarks", this);
		};

		/* #endregion */
	}


	function addDropdownHandler(dropdown, itemList, offset) {
		if (dropdown && itemList) {
			Array.prototype.forEach.call(
				dropdown.querySelectorAll("a"),
				function (node) {
					node.parentNode.removeChild(node);
				}
			);

			if(itemList.length === 0)
				return false;

			dropdown.style.display = "block";
			dropdown.style.left = offset;

			itemList.forEach((element) => {
				let newElem = document.createElement("a");
				newElem.value = element.parentNode.querySelector("td#eventLineNumber").innerText;
				newElem.textContent = newElem.value;
				if(element.parentNode.querySelector("td#elementInstanceName"))
					newElem.textContent += ' - ' + element.parentNode.querySelector("td#elementInstanceName").title;
				newElem.onclick = function () {
					window.parent.frames[1].document.querySelector("td#eventLineNumber[title='" + this.value + "']").scrollIntoView(false, { behavior: "smooth" });
				};
				dropdown.appendChild(newElem);
			})
			
			let elem = document.createElement("a");
			elem.style = "border-top: 1px solid #aaa;"
			elem.textContent = "Close";
			elem.onclick = function () {
				dropdown.style.display = "none";
			};
			dropdown.appendChild(elem);
			return false;
		} else console.log("[PDT] addDropdownHandler - wrong arguments");
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

	window.parent.frames[1].document.body.insertAdjacentHTML('afterbegin', '<div class="PDTdropdown warnings"></div>');
	window.parent.frames[1].document.body.insertAdjacentHTML('afterbegin', '<div class="PDTdropdown errors"></div>');
	window.parent.frames[1].document.body.insertAdjacentHTML('afterbegin', '<div class="PDTdropdown bookmarks"></div>');

	//TODO:
	//displayPage = new Function('pageXML','pageName','pagePropertyName', displayPage.toString().match(/{([\s\S]*)}/)[1].replace('window.open(strURL,strForm,"status=yes,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes"  + strFeatures)', "window.open(strURL,'_blank')"));
});