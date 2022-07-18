const containerTabList = document.querySelector("div.tStrCntr ul");

if(containerTabList) {
	const containerTabListCallback = function (mutationsList, observer) {
		mutationsList.forEach((mutation) => {
			mutation.addedNodes.forEach((node) => {
				//console.log(node.nodeName);
				if (node.nodeName == "LI") {	//rule name				
					node.querySelectorAll("table#RULE_KEY span[data-stl='1']").forEach(function (elem) {
						elem.addEventListener("mousedown", function (e) {
							//console.log(e);
							if (e && (e.which == 2 || e.button == 4)) {
								this.parentNode.parentNode.querySelector('#close').click();
							}
						})
					}
					);			
				}
				if (node.nodeName == "svg") {	//icon
					node.addEventListener("mousedown", function (e) {
						//console.log(e);
							if (e && (e.which == 2 || e.button == 4)) {
								this.parentNode.parentNode.querySelector('#close').click();
							}
						}
					);	
				}
			}
			);
		});
	};

	const containerTabListObserver = new MutationObserver(containerTabListCallback);
	containerTabListObserver.observe(containerTabList, { childList: true, subtree: true });

	console.log("PDT: closeTabMiddleClick.js loaded"); 
} else {
	console.log("PDT: closeTabMiddleClick.js tab container not found");
}