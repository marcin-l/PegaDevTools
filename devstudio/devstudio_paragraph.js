console.log("PDT: devstudio/devstudio_paragraph.js");

var tarea = document.querySelector("span.TextAreaContainer textarea");
var myCodeMirror = CodeMirror.fromTextArea(tarea, {
	mode: "htmlmixed",
	lineNumbers: true,
	lineWrapping: true,
	selectionPointer: true,
	foldGutter: true,
	gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
	matchTags: { bothTags: true },
	extraKeys: {
		"Ctrl-J": "toMatchingTag",
		F11: function (cm) {
			cm.setOption("fullScreen", !cm.getOption("fullScreen"));
		},
		Esc: function (cm) {
			if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
		},
	},
	autoCloseTags: true,
    // highlightSelectionMatches: {showToken: /\w/, annotateScrollbar: true}
});
