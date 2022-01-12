document.onkeyup = function(e) {
	if (e.key == "Enter" && e.ctrlKey) {
        if(window.parent.document == document)
		    document.querySelector("div.ui-resizable-handle").click();
        else
            window.parent.document.querySelector("div.ui-resizable-handle").click();
	}
}

console.log("PDT: sidebarToggle.js loaded"); 