const containerTabList = document.querySelector("div.tStrCntr ul");

const containerTabListCallback = function (mutationsList, observer) {
	mutationsList.forEach((mutation) => {
		mutation.addedNodes.forEach((node) => {
			if (node.nodeName == "LI") {
				node.querySelectorAll("table#RULE_KEY span[data-stl='1']").forEach(function (elem) {
					elem.addEventListener("mousedown", function (e) {
						//console.log(e);
						if (e && (e.which == 2 || e.button == 4))
							this.parentNode.parentNode.querySelector('#close').click();
					})
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

