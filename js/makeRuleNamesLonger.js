const containerTabListNames = document.querySelector("div.tStrCntr ul");

const containerTabListCallbackNames = function (mutationsList, _observer) {
    mutationsList.forEach((mutation) => { 
        if(mutation.attributeName == "aria-label"){
            if (mutation.target.nodeName == "LI") {
                mutation.target.classList.add("PDTmakeRuleNamesLonger");
                let titleOriginal = mutation.target.querySelector("span[inanchor]").innerText;
                if(titleOriginal.endsWith("...")) {                    
                    let title = mutation.target.getAttribute("aria-label").replace("Press Delete to close the current tab", "").trim();
                    titleOriginal = titleOriginal.replace("...", "");
                    if(!title.startsWith(titleOriginal)) {
                        title = mutation.target.getAttribute("title").trim();
                    }
                    if (title && title.startsWith(titleOriginal)) {
                        title = title.length > 20 ? title.substring(0, 20) + "..." : title;
                        mutation.target.querySelector("span[inanchor]").innerText = title;
                    }
                }
            }
        }
	});
};

const containerTabListNamesObserver = new MutationObserver(containerTabListCallbackNames);
containerTabListNamesObserver.observe(containerTabListNames, 
    { 
        attributeFilter: [ "aria-label"],
        subtree: true
    }
);

console.log("PDT: makeRuleNamesLonger.js loaded"); 
