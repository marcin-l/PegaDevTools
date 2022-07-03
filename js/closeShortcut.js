document.onkeyup = function(e) {
	if (e.key == "q" && e.ctrlKey) {
                //if(e.srcELement.localName != "input" && e.srcELement.tagName != "INPUT" && e.srcELement.type != "text")
                doClose();
	}
}

console.log("PDT: closeShortcut.js loaded"); 