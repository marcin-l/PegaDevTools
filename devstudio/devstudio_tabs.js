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
            text: "⦻ Close tab",
            action: () => { if(tabClicked.querySelector('#close')) tabClicked.querySelector('#close').click(); }
        },    
        { isDivider: true },
        {
            text: "☓ Close this menu",
            action: () => { /* empty action just closes menu */  }        
        }    
    ]

    //FEATURE: menus
    $("div.dc-header div.pegaTabGrp div.tStrCntr ul").on(
        "contextmenu",
        "li",
        function (evt) { 
            evt.preventDefault();
            tabClicked = this;
            ctxmenu.show(menuDefinition, evt);
    });
}

document.arrive("body[data-PDTSettings='loaded']", {onceOnly: true, existing: true}, () => {
    if(PDT.settings.devstudio.useTabMenu) {
        applyTabMenu();
    }

    //FEATURE: scroll tabs with mouse wheel
    if (PDT.settings.devstudio.mouseScrollTabs) {
        injectScript("/js/", "mouseScrollTabs.js");
    }

    //FEATURE: expand tabs on hover
    if (PDT.settings.devstudio.expandTabOnHover) {
        //inject script which will apply it for newly opened tabs
        injectScript("/js/", "expandTabOnHover.js");
    }      

    //FEATURE: checkout indicator
    if (PDT.settings.devstudio.checkoutIndicator) {
        showCheckoutIndicator();
    }

    //FEATURE: close tab on middle click
    if (PDT.settings.devstudio.closeTabMiddleClick) {
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
    if (PDT.settings.devstudio.hideCloseButton)
        injectStyles("div.tStrCntr ul #close {display: none}");

    if (PDT.settings.devstudio.longerRuleNames) {
        //inject script which will apply it for newly opened tabs
        injectScript("/js/", "makeRuleNamesLonger.js");

        injectStyles(
            ".Temporary_top_tabs .Temporary_top_tabsList LI span#TABANCHOR { padding-right: 4px !important; padding-left: 4px; !important}"
        );
    }
});
