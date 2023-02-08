$.get(browser.runtime.getURL("tracer/tracerOptionSets.html"), function (data) {
	//add html
	document.querySelectorAll("div#ProfileDiv div.dialogDataContainer table table td")[2].querySelectorAll("table")[0].insertAdjacentHTML("afterend", data);
	document.addEventListener('click', function (e) {
		if (e.target) {
			if (e.target.id == 'PDTConfigurationProfileSaveBtn')
				addSaveOptionSet();
			else if (e.target.id == 'delConfigProfile')
				removeOptionSet();
			else if (e.target.id == 'loadConfigProfile')
				loadOptionSet();
		}
	});

	injectScript("/tracer/", "tracerOptionsSets.js");
	restoreOptionSets();
});

function getSelectedEventTypes() {
	let eventTypeArray = new Array();
	document.querySelectorAll("div#EventTypesDisplay table table td.dataLabelStyle").forEach(function (val) { if (val.querySelector("input[type='CHECKBOX']:checked")) (eventTypeArray.push(val.textContent)) });
	return eventTypeArray;
}

function getSelectedRulesets() {
	let rulesetArray = new Array();
	document.querySelectorAll("div#RuleSetDisplay table table td.dataLabelStyle").forEach(function (val) { if (val.querySelector("input[type='CHECKBOX']:checked")) (rulesetArray.push(val.textContent)) });
	return rulesetArray;
}
let optionSets = new Array();

function addSaveOptionSet() {
	let optionSet = new Object();
	optionSet.name = document.getElementById("PDTConfigurationProfileNewName").value;
	optionSet.eventTypes = getSelectedEventTypes();
	optionSet.rulesets = getSelectedRulesets();
	optionSets.push(optionSet);
	console.log("Added profile" + optionSet.name);
	saveOptionSets();
}

//Saves options to browser.storage
function saveOptionSets() {
	browser.storage.local.set({
		optionSets: optionSets
	}, function () {
		restoreOptionSets();
		document.getElementById("PDTConfigurationProfileNew").style.display = "none";
		//Update status to let user know options were saved
		let status = document.getElementById('status');
		status.textContent = 'Configuration saved';
		setTimeout(function () {
			status.textContent = '';
		}, 750);
	});
}

function getOptionSets(callback) {
	browser.storage.local.get(["optionSets"], function (data) {
		console.log(data);
		if (typeof data.optionSets !== "undefined" && typeof data.optionSets.length !== "undefined") {
			optionSets = data.optionSets;
			if (callback)
				callback();
		}
	});
}

function restoreOptionSets() {
	getOptionSets(fillDropdown);
}

function fillDropdown() {
	let select = document.getElementById("configList");
	if (!select)
		console.log("Could not find configList");
	else {
		//clear input
		for (let o of document.querySelectorAll('#configList > option')) {
			o.remove()
		}

		//fill input from current optionSets
		optionSets.forEach(function (element) {
			let opt = document.createElement("option");
			opt.className = "PDTTracerOption"
			//console.log("Loaded profile " + element.name);
			opt.value = opt.innerHTML = element.name;
			select.appendChild(opt);
		});
	}
}

function removeOptionSet() {
	let selectedOption = document.getElementById("configList").value;
	//getOptionSets();
	let idx = optionSets.findIndex(({name}) => name === selectedOption);
	optionSets.splice(idx, 1);
	saveOptionSets();
	fillDropdown();
}

function loadOptionSet() {
	let selectedOptionValue = document.getElementById("configList").value;
	let selectedOptionSet = optionSets.find(({name}) => name === selectedOptionValue);
	if(selectedOptionSet) {
		loadEventTypes(selectedOptionSet.eventTypes);
		loadRulesets(selectedOptionSet.rulesets);
	}
}

function loadEventTypes(eventTypes) {
	document.querySelectorAll("div#EventTypesDisplay table table td.dataLabelStyle").forEach(function (val) { 
		let checkBox = val.querySelector("input[type='CHECKBOX']");
		if(checkBox) {
			checkBox.checked = (eventTypes.findIndex(function(element) { return element === val.textContent; }) >-1 );
		}
	});
}

function loadRulesets(rulesets) {
	document.querySelectorAll("div#RuleSetDisplay table table td.dataLabelStyle").forEach(function (val) { 
		let checkBox = val.querySelector("input[type='CHECKBOX']");
		if(checkBox) {
			checkBox.checked = (rulesets.findIndex(function(element) { return element === val.textContent; }) >-1 );
		}
	});
}

//TODO: WiP
function responsiveLayout() {
	document.querySelectorAll("div#ProfileDiv div.dialogDataContainer table table td")[2].className = "PDTrow";
}

//get config
function siteConfigCallback(_siteConfig, globalConfig) {
	if (!globalConfig.settings || (globalConfig.settings && globalConfig.settings.tracer.disabled)) {
		console.log('PDT tracer disabled');
	} else {
		//FEATURE: Display settings in fullscreen
		if (globalConfig.settings.tracer.settingsFullscreen) {
			PDT.makeFullscreen();
		}
	}
}

function eventTypesSetAll(checkState) {
	document.querySelectorAll("div#EventTypesDisplay table table td.dataLabelStyle input[type='CHECKBOX']").forEach(function (el) { el.checked = checkState } )
}

//FEATURE: Select/deselect all event types
fetch(browser.runtime.getURL("tracer/tracer_eventTypeSelection.html"))
	.then(response => response.text())
    .then( (text) => {
	document.querySelector("div#EventTypesDisplay table table table tr").insertAdjacentHTML("afterend", text);
});

document.arrive("button#PDTDeselectAllEventTypes", {onceOnly: true, existing: true}, () => 	{
	document.querySelector("button#PDTSelectAllEventTypes").addEventListener("click", () => document.querySelectorAll("div#EventTypesDisplay table table td.dataLabelStyle input[type='CHECKBOX']").forEach(function (el) { el.checked = true } ));
	document.querySelector("button#PDTDeselectAllEventTypes").addEventListener("click", () => document.querySelectorAll("div#EventTypesDisplay table table td.dataLabelStyle input[type='CHECKBOX']").forEach(function (el) { el.checked = false } ));
});

//FEATURE: Select/deselect all Pega rulesets
fetch(browser.runtime.getURL("tracer/tracer_pegaRulesetSelection.html"))
	.then(response => response.text())
    .then( (text) => {
	document.querySelector("div#RuleSetDisplay table tr").insertAdjacentHTML("beforeend", text);
});

document.arrive("button#PDTDeselectPegaRulesets", {onceOnly: true, existing: true}, () => 	{
	document.querySelector("button#PDTSelectPegaRulesets").addEventListener("click", () => document.querySelectorAll("div#RuleSetDisplay table table table td.dataLabelStyle input[type='CHECKBOX']").forEach(function (el) { if(el.nextSibling.textContent.trim().startsWith("Pega")) el.checked = true } ));
	document.querySelector("button#PDTDeselectPegaRulesets").addEventListener("click", () => document.querySelectorAll("div#RuleSetDisplay table table table td.dataLabelStyle input[type='CHECKBOX']").forEach(function (el) { if(el.nextSibling.textContent.trim().startsWith("Pega")) el.checked = false } ));
});

siteConfig(siteConfigCallback);