console.log("PDT: devstudio/devstudio_paragraph.js");

var tries = 0;
var mainDiv;

function addObserver() {
    const paragraphSection = document.querySelector("div[node_name='pzViewParagraph']");
    
    const paragraphCallback = function (mutationsList, observer) {
        mutationsList.forEach((mutation) => {
            applyCodeMirror();
        });
    };
    
    const paragraphObserver = new MutationObserver(paragraphCallback);
    paragraphObserver.observe(paragraphSection, {
        childList: true,
    })
}

var myCodeMirror;

function applyCodeMirror() {
    //injectStyles(".CodeMirror { height: auto;}");
    var tarea = document.querySelector("span.TextAreaContainer textarea");
	if (tarea) {
        console.log("PDT: devstudio/devstudio_paragraph.js applying CodeMirror");
		myCodeMirror = CodeMirror.fromTextArea(tarea, {
			mode: "htmlmixed",
			lineNumbers: true,
			lineWrapping: true,
			selectionPointer: true,
            styleActiveLine: true,
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

        function updateTextArea() {
            myCodeMirror.save();
        }
        
        myCodeMirror.on("change", updateTextArea);        
	}
}


function waitUntilRender() {
    mainDiv =  document.querySelector("div[node_name='pzViewParagraph']");
    if (mainDiv) {
        applyCodeMirror();
        addObserver();
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



var dom_observer = new MutationObserver(function(mutationsList) {
    mutationsList.forEach((mutation) => {
        console.log(mutation);
    });
});
var container = document.documentElement || document.body;
console.log(container);
var config = { attributes: true, childList: true };
dom_observer.observe(container, config);

