console.log("PDT: devstudio/devstudio_tabs.js");

function applyTabMenu() {
    let tabClicked;

    let menuDefinition = [
        {
            text: "⇐ Move left",
            action: () => {
                if(tabClicked.previousSibling && tabClicked.previousSibling.getAttribute("section_index") !="1")
                    tabClicked.parentElement.insertBefore(tabClicked, tabClicked.previousSibling)
            }
        },
        {
            text: "⇒ Move right",
            action: () => {
                if(tabClicked.nextSibling && tabClicked.parentElement && !(tabClicked.nextSibling.classList.contains("rightborder")))
                    tabClicked.parentElement.insertBefore(tabClicked.nextSibling, tabClicked)
            }
        },
        { isDivider: true },
        {
            text: "⚐ Mark",
            action: () => {
                tabClicked.querySelectorAll("span#TABANCHOR, span#TABSPAN").forEach((s) => {
                    if(s.style.backgroundColor == "rgb(169, 7, 30)")
                        s.style.backgroundColor = null;
                    else
                        s.style.backgroundColor = "rgb(169, 7, 30)";
                })
            }
        },
        { isDivider: true },
        {
            text: "ŀ Move to split view",
            action: () => {
                let tabId = document.querySelector("div[data-node-id='pzStudioContainerTabs'] div.tStrCntr ul li[aria-selected='true']").id;
                let tabDynamicContainer = document.querySelector(`div.dynamicContainer[aria-labelledby='${tabId}']`)
                if(tabDynamicContainer) {
                    tabDynamicContainer.style.width = "50%";
                    tabDynamicContainer.style.display = "block";
                }

                tabId = tabClicked.id;
                tabDynamicContainer = document.querySelector(`div.dynamicContainer[aria-labelledby='${tabId}']`)
                if(tabDynamicContainer) {
                    tabDynamicContainer.style.width = "50%";
                    tabDynamicContainer.style.right = "0";
                    tabDynamicContainer.style.display = "block";
                }
                else {
                    alert('Oops, something went wrong');
                }
            }
        },
        {
            text: "ŀ Exit split view",
            action: () => {
                let tabId = document.querySelector("div[data-node-id='pzStudioContainerTabs'] div.tStrCntr ul li[aria-selected='true']").id;
                let tabDynamicContainer = document.querySelector(`div.dynamicContainer[aria-labelledby='${tabId}']`)
                if(tabDynamicContainer) {
                    tabDynamicContainer.style.width = "100%";
                    tabDynamicContainer.style.display = "block";
                }

                document.querySelector('div.dynamicContainer[style*="width: 50%"]').style = "display: hidden";
            }
        },
        { isDivider: true },
        {
            text: "↪ Close",
            subMenu: [
                {
                    text: "⦻ This tab",
                    action: () => { if(tabClicked.querySelector('#close')) tabClicked.querySelector('#close').click(); }
                },
                {
                    text: "↤ All to the Left",
                    action: () => { closeAllLeft(tabClicked); }
                },
                {
                    text: "↦ All to the Right",
                    action: () => { closeAllRight(tabClicked); }
                },
                {
                    text: "⇹ All other tabs",
                    action: () => {  closeAllLeft(tabClicked); closeAllRight(tabClicked); }
                }
            ]
        },
        {
            text: "☓ Close this menu",
            action: () => { } // empty action just closes menu
        }
    ]

    //FEATURE: menus
    $("div.dc-header div.pegaTabGrp div.tStrCntr ul").on(
        "contextmenu",
        "li",
        function (evt) {
            evt.preventDefault();
            tabClicked = this;
            let menuDefinitionEditable = menuDefinition.slice();;
            //let menuDefinitionEditable = structuredClone(menuDefinition);
            //let menuDefinitionEditable = JSON.parse(JSON.stringify(menuDefinition));

            if(evt.currentTarget.classList.contains("selected")) {
                //remove split view
                menuDefinitionEditable.splice(6, 1);
            } else {
                menuDefinitionEditable.splice(7, 1);
            }
            ctxmenu.show(menuDefinitionEditable, evt);
    });
}

// close tabs to the left
function closeAllLeft(elem) {
	if(elem.previousSibling)
		closeAllLeft(elem.previousSibling);
	if(elem.querySelector('#close'))
		elem.querySelector('#close').click();
}

// close tabs to the right
function closeAllRight(elem) {
	if(elem.nextSibling)
		closeAllRight(elem.nextSibling);
	if(elem.querySelector('#close'))
		elem.querySelector('#close').click();
}

PDT.settings().then(settings => {
    if(settings?.devstudio?.useTabMenu)
        applyTabMenu();

        //FEATURE: scroll tabs with mouse wheel
    if (settings?.devstudio?.mouseScrollTabs) {
        injectScript("/js/", "mouseScrollTabs.js");
    }

    //FEATURE: expand tabs on hover
    if (settings?.devstudio?.expandTabOnHover) {
        //inject script which will apply it for newly opened tabs
        injectScript("/js/", "expandTabOnHover.js");
    }

    //FEATURE: checkout indicator
    if (settings?.devstudio?.checkoutIndicator) {
        showCheckoutIndicator();
    }

    //FEATURE: close tab on middle click
    if (settings?.devstudio?.closeTabMiddleClick) {
        //inject script which will apply it for newly opened tabs
        injectScript("/js/", "closeTabMiddleClick.js");

        // apply for existing tabs
        document.querySelectorAll("div.tStrCntr ul table#RULE_KEY span[data-stl='1'], div.tStrCntr ul table#RULE_KEY svg").forEach(function (elem) {
            elem.addEventListener("mousedown", function (e) {
                console.log(e);
                if (e && (e.which == 2 || e.button == 4))
                    this.parentNode.parentNode.querySelector('#close').click();
            })
        })
    }

    //FEATURE: hide close button
    if (settings?.devstudio?.hideCloseButton)
        injectStyles("div.tStrCntr ul #close {display: none}");

    if (settings?.devstudio?.longerRuleNames) {
        //inject script which will apply it for newly opened tabs
        injectScript("/js/", "makeRuleNamesLonger.js");

        // apply for existing tabs
        injectStyles(
            ".Temporary_top_tabs .Temporary_top_tabsList LI span#TABANCHOR { padding-right: 4px !important; padding-left: 4px; !important}"
        );
    }
});
