console.log("PDT: devstudio/devstudio_ruleform_popup.js");

var tries = 0;
var mainDiv;

function applyCodeMirror() {
	var tarea = document.querySelector("div[data-ui-meta*='pzShowPageXML'] pre");
	if (tarea) {
		console.log("PDT: devstudio/devstudio_ruleform_popup.js applying CodeMirror");
		injectStyles(".CodeMirror { height: auto;}");
		var text = tarea.textContent || tarea.innerText;
		var myCodeMirror = CodeMirror(
			function (elt) {
				tarea.parentNode.parentNode.parentNode.replaceChild(elt, tarea.parentNode.parentNode);
			},
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

		myCodeMirror.setSelection({
			'line':myCodeMirror.firstLine(),
			'ch':0,
			'sticky':null
		  },{
			'line':myCodeMirror.lastLine(),
			'ch':0,
			'sticky':null
		  },
		  {scroll: false});
		  //auto indent the selection
		  myCodeMirror.indentSelection("smart");
		  myCodeMirror.setCursor({'line': 1});
	}
}

function waitUntilRender() {
	mainDiv = document.querySelector("div[data-ui-meta*='pzShowPageXML'] pre");
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

waitUntilRender();
