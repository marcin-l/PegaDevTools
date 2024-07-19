console.log("PDT: devstudio/devstudio_ruleform_popup.js");

var tries = 0;
var mainDiv;

function callback1(textArea, elt) {
	textArea.parentNode.parentNode.parentNode.replaceChild(elt, textArea.parentNode.parentNode);
}

function applyCodeMirrorForElement(element, text, useCallback = false) {
	console.log("PDT: devstudio/devstudio_ruleform_popup.js applying CodeMirror");
	injectStyles(".CodeMirror { height: auto }");

	let myCodeMirror = CodeMirror(
		() => {if(useCallback) callback1(element, element)},
		{
			mode: "xml",
			value: text,
			readOnly: true,
			lineNumbers: true,
			lineWrapping: true,
			selectionPointer: true,
			foldGutter: true,
			gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
			matchTags: { bothTags: true },
			extraKeys: {
				"Ctrl-J": "toMatchingTag"
			},
			// highlightSelectionMatches: {showToken: /\w/, annotateScrollbar: true}
		}
	);

	myCodeMirror.setSelection(
		{
			'line': myCodeMirror.firstLine(),
			'ch': 0,
			'sticky': null
		},
		{
			'line': myCodeMirror.lastLine(),
			'ch': 0,
			'sticky': null
		},
		{
			scroll: false
		});
	// auto indent the selection
	myCodeMirror.indentSelection("smart");
	myCodeMirror.setCursor({ 'line': 1 });
}

function applyCodeMirror() {
	let textArea = document.querySelector("div[data-ui-meta*='pzShowPageXML'] pre");
	if (textArea) {
		let text = textArea.textContent || textArea.innerText;
		applyCodeMirrorForElement(textArea, text, true);
	} else {
		let pageData = document.querySelector("div#webkit-xml-viewer-source-xml pagedata");
		let text = pageData.innerText;
		applyCodeMirrorForElement(pageData, text);
	}
}

function waitUntilRender() {
	mainDiv = document.querySelector("div[data-ui-meta*='pzShowPageXML'] pre, div#webkit-xml-viewer-source-xml pagedata");
	if (mainDiv) {
		applyCodeMirror();
	} else {
		tries = tries + 1;
		console.log(tries);
		if (tries > 10) return;
		setTimeout(() => {
			waitUntilRender();
		}, 500);
	}
}

//TODO: use arrive.js
waitUntilRender();
