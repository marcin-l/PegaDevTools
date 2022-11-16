const containerTabListNames = document.querySelector("div.tStrCntr ul");

if(containerTabListNames) {

    const containerTabListCallbackNames = function (mutationsList, _observer) {
        mutationsList.forEach((mutation) => { 
            if(mutation.attributeName == "aria-label"){
                if (mutation.target.nodeName == "LI") {
                    mutation.target.classList.add("PDTmakeRuleNamesLonger");
                    let title = mutation.target.getAttribute("aria-label");
                    if (title) {
                        title = title.length > 20 ? title.substring(0, 20) + "..." : title;
                        mutation.target.querySelector("span[inanchor]").innerText = title;
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
}

console.log("PDT: makeRuleNamesLonger.js loaded"); 
