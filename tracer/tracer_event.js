//TODO: remove jQuery
console.log("PDT tracer_event.js");
PDT.isTracerEnabled().then(isTracerEnabled => {

	if (!isTracerEnabled) {
		console.log("PDT tracer disabled");
	} else {		
		applyPDTCustomization();
	}
});

function applyPDTCustomization() {
	//FEATURE: Mark row on right-click
	$("div#traceEvent-CONTAINER").on("contextmenu", "td#eventLineNumber", function (evt) { evt.preventDefault(); $(this).parent().toggleClass("PegaDevToolsTextRed"); });

	//FEATURE: Remove columns
	const removeThreadNameButton = $('<span title="Remove column" class="removeColumn">x</span>');
	removeThreadNameButton.click(function () {
		injectStyles('td.EventDataCenter#threadname { display: none}');
		document.querySelectorAll('td.eventTitleBarStyle[title="Thread"], d.EventDataCenter#threadname').forEach(e => e.remove())
	});
	$('td.eventTitleBarStyle[title="Thread"]').append(removeThreadNameButton);

	const removeIntBtn = $('<span title="Remove column" class="removeColumn">x</span>');
	removeIntBtn.click(function () {
		injectStyles('div#traceEvent-CONTAINER table td:nth-child(6) { display: none}');
		document.querySelectorAll('td.eventTitleBarStyle[title="Int"], div#traceEvent-CONTAINER table td:nth-child(6)').forEach(e => e.style.display = 'none')
	});
	$('td.eventTitleBarStyle[title="Int"]').append(removeIntBtn);

	const removeElapsedBtn = $('<span title="Remove column" class="removeColumn">x</span>');
	removeElapsedBtn.click(function () {
		injectStyles('div#traceEvent-CONTAINER table td:nth-child(13) { display: none}');
		document.querySelectorAll('td.eventTitleBarStyle[title="Elapsed"], div#traceEvent-CONTAINER table td:nth-child(13)').forEach(e => e.style.display = 'none')
	});
	$('td.eventTitleBarStyle[title="Elapsed"]').append(removeElapsedBtn);

	const removeRuleNoBtn = $('<span title="Remove column" class="removeColumn">x</span>');
	removeRuleNoBtn.click(function () {
		injectStyles('div#traceEvent-CONTAINER table td:nth-child(7) { display: none}');
		document.querySelectorAll('td.eventTitleBarStyle[title="Rule#"], div#traceEvent-CONTAINER table td:nth-child(7)').forEach(e => e.style.display = 'none')
	});
	$('td.eventTitleBarStyle[title="Rule#"]').append(removeRuleNoBtn);

	const removeAllColumnsBtn = $('<div title="Remove all columns" class="removeColumn">X</div>');
	removeAllColumnsBtn.click(function () {
		$('span.removeColumn').click();
		this.remove();
	});
	$('td.eventTitleBarStyle[title="Line"]').prev().append(removeAllColumnsBtn);

	//FEATURE: pin icon in header to toggle floating headers
	let pin = document.createElement("td");
	pin.setAttribute("title", "toggle floating header");
	pin.style.width = "1%";
	pin.style.minWidth = "18px";
	let pinButton = document.createElement("span");
	pinButton.innerText = "📌";
	pinButton.style.cursor = "pointer";

	function toggleHeaderFloat(elem, skipSave = false) {
		let tracerHeader = document.querySelector("table#traceEvent-TABLE");
		if (tracerHeader.style.position === "sticky") {
			tracerHeader.style.position = "static";			
			elem.style.textDecoration = "line-through";
			elem.style.opacity = "0.6";
			if(!skipSave)
				browser.storage.local.set({ tracerPinHeader: false }, () => {
					//console.log('PDT tracer floating header saved: false');
				});
		} else {
			tracerHeader.style.position = "sticky";
			tracerHeader.style.top = "0";
			elem.style.textDecoration = "initial";
			elem.style.opacity = "1";
			if(!skipSave)
				browser.storage.local.set({ tracerPinHeader: true }, () => {
					//console.log('PDT tracer floating header saved: true');
				});
		}
	}

	pinButton.addEventListener("click", function (event) {
		toggleHeaderFloat(event.target);
	});
	pin.appendChild(pinButton);
	document.querySelector('table#traceEvent-TABLE tr').appendChild(pin);

    browser.storage.local.get('tracerPinHeader', (data) => {
        if (data.tracerPinHeader) {
            if(data.tracerPinHeader) {
				toggleHeaderFloat(pinButton, true);
            	console.log('PDT floating header restored: true');
			}
        } else {
            console.log('PDT floating header could not be restored');		
        }
    });

	//TODO FEATURE: override browser search. show options to highlight all, find last


}