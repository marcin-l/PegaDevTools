const containerTabListNamesHover = document.querySelector("div.tStrCntr ul");

const containerTabListCallbackNamesHover = function (mutationsList, observer) {
    mutationsList.forEach((mutation) => { 
        if(mutation.attributeName == "aria-label"){
            if (mutation.target.nodeName == "LI") {
                if (!mutation.target.classList.contains("PDTexpandTabOnHover")) {
                    mutation.target.classList.add("PDTexpandTabOnHover");
                    
                    mutation.target.querySelector("span[inanchor]").addEventListener("mouseenter", function(event) {
                        let origText = event.target.innerText;

                        // expand name                        
                        let parentLi = event.target.closest("li");
                        if(parentLi.getAttribute("aria-label")) {
                            event.target.innerText = parentLi.getAttribute("aria-label");
                    
                            // reset after a short delay
                            setTimeout(function() {
                                event.target.innerText = origText;
                            }, 2000, origText);
                        }
                    }, false);
                }
            }
        }
	});
};

const containerTabListNamesHoverObserver = new MutationObserver(containerTabListCallbackNamesHover);
containerTabListNamesHoverObserver.observe(containerTabListNamesHover, 
    { 
        attributeFilter: [ "aria-label"],
        subtree: true
    }
);

console.log("PDT: expandTabOnHover.js loaded"); 
