
PDT.setScriptsApplied();
console.log("PDT: devstudio/devstudio_paragraph.js");

/* //TODO: currently broken. does not work on reload
document.arrive("span.TextAreaContainer textarea", {onceOnly: true, existing: true}, () => {
    applyCodeMirror();
});

// var tries = 0;
// var mainDiv;

// function addObserver() {
//     const paragraphSection = document.querySelector("div[node_name='pzViewParagraph']");
    
//     const paragraphCallback = function (mutationsList, observer) {
//         mutationsList.forEach((mutation) => {
//             applyCodeMirror();
//         });
//     };
    
//     const paragraphObserver = new MutationObserver(paragraphCallback);
//     paragraphObserver.observe(paragraphSection, {
//         childList: true,
//     })
// }
if(typeof myCodeMirror !== "undefined")
    myCodeMirror.destroy();

let myCodeMirror;

function applyCodeMirror() {
    //injectStyles(".CodeMirror { height: auto;}");
    if(document.querySelector("divCodeMirror-wrap"))
        document.querySelector("divCodeMirror-wrap").remove();
    let textArea = document.querySelector("span.TextAreaContainer textarea");
	if (textArea) {
        console.log("PDT: devstudio/devstudio_paragraph.js applying CodeMirror");
		myCodeMirror = CodeMirror.fromTextArea(textArea, {
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


// function waitUntilRenderRS() {
//     mainDiv =  document.querySelector("div[node_name='pzViewParagraph']");
//     if (mainDiv) {
//         applyCodeMirror();
//         addObserver();
//     } else {
//         tries = tries + 1;
//         console.log(tries);
//         if (tries > 10) return;
//         setTimeout(() => {
//             waitUntilRenderRS();
//         }, 500);
//     }
// }

// waitUntilRenderRS();



// var dom_observer = new MutationObserver(function(mutationsList) {
//     mutationsList.forEach((mutation) => {
//         console.log(mutation);
//     });
// });
// var container = document.documentElement || document.body;
// console.log(container);
// var config = { attributes: true, childList: true };
// dom_observer.observe(container, config);

*/