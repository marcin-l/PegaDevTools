console.log("PDT: tracer/tracer_event_menus.js");

//FEATURE: menus

// //FEATURE: Mark row on right-click
// $("div#traceEvent-CONTAINER").on("contextmenu", "td#eventLineNumber", function (evt) { evt.preventDefault(); $(this).parent().toggleClass("PegaDevToolsTextRed"); });

let bookmarksButton;

function syncBookmarks() {
    if(!bookmarksButton) {
        bookmarksButton = window.parent.frames[0].document.querySelector("div.btnPDTGroup.greyPDT");
    }
    let bookmarksCount = document.querySelectorAll("td[data-PDTbookmark]").length;
    let newTextContent = "Bookmarks";
    if(bookmarksCount > 0) {
        bookmarksButton.classList.remove("initiallyHidden");
        newTextContent = "Bookmarks" + String.fromCharCode(160);
        newTextContent += "" + bookmarksCount;
    } else {
        bookmarksButton.classList.add("initiallyHidden");
    }
    bookmarksButton.querySelector("button#btnPDTBookmarks").textContent = newTextContent;
}

const menuLineNumberStructure = [
    {
        text: "&nbsp;⚐ Mark",
        action: () => {
            contextTarget.parentNode.classList.toggle("PegaDevToolsTextRed")
        }
    },
    {
        text: "🔖 Add to bookmarks",
        action: () => {
            contextTarget.parentNode.classList.toggle("PegaDevToolsTextBlue");
            contextTarget.setAttribute("data-PDTbookmark", true);
            //let bookmarksButton = window.parent.frames[0].document.querySelector("div.btnPDTGroup.greyPDT");
            syncBookmarks();
        },
        disabled: () => {
            return contextTarget.getAttribute("data-PDTbookmark");
        }
    },
    {
        text: "🔖 Remove from bookmarks",
        action: () => {
            contextTarget.parentNode.classList.toggle("PegaDevToolsTextBlue");
            contextTarget.removeAttribute("data-PDTbookmark");
            syncBookmarks();
        },
        disabled: () => {
            return !contextTarget.getAttribute("data-PDTbookmark");
        }
    },       
    { isDivider: true },
    {
        text: "⇑ Remove next events",
        action: () => {
            let eventNumber = parseInt(contextTarget.getAttribute("title"));
            document.querySelectorAll('tr#eventRow').forEach( row => { if(parseInt(row.querySelector("td#eventLineNumber").getAttribute("title")) > eventNumber) row.remove() });
            syncBookmarks();
        }
    },
    {
        text: "⇓ Remove previous events",
        action: () => {
            let eventNumber = parseInt(contextTarget.getAttribute("title"));
            document.querySelectorAll('tr#eventRow').forEach( row => { if(parseInt(row.querySelector("td#eventLineNumber").getAttribute("title")) < eventNumber) row.remove() });
            syncBookmarks();
        }
    },
    { isDivider: true }, 
    {
        text: "☓ Close this menu",
        action: () => { /* empty action just closes menu */  }   
    } 
];

const menuInstanceNameStructure = [
    {
        text: "↪ Jump to",
        subMenu: [           
            {
                text: "↟ Last occurrence",
                action: () => {
                    let eventInstance = contextTarget.title;
                    let instancesByTitle = document.querySelector("td#elementInstanceName[title='" + eventInstance + "']");
                    instancesByTitle.scrollIntoView(false);                    
                }                
            },
            {
                text: "↟ Last step (if applicable)",
                action: () => {
                    let tmpNodeList = contextTarget.parentElement.querySelectorAll("td.eventDataCenter");
                    let ruleNo = tmpNodeList[tmpNodeList.length-1].getAttribute("title");
                    let instancesByRuleNo = document.querySelector("td.eventDataCenter[title='" + ruleNo + "']");
                    instancesByRuleNo.scrollIntoView(false);                 
                }                
            },
            {
                text: "↡ First occurrence",
                action: () => {
                    let eventInstance = contextTarget.title;
                    let instancesByTitle = document.querySelectorAll("td#elementInstanceName[title='" + eventInstance + "']");
                    instancesByTitle[instancesByTitle.length - 1].scrollIntoView(false);
                }                
            },
            {
                text: "↡ First step (if applicable)",
                action: () => {
                    let tmpNodeList = contextTarget.parentElement.querySelectorAll("td.eventDataCenter");
                    let ruleNo = tmpNodeList[tmpNodeList.length-1].getAttribute("title");
                    let instancesByRuleNo = document.querySelectorAll("td.eventDataCenter[title='" + ruleNo + "']");
                    instancesByRuleNo[instancesByRuleNo.length - 1].scrollIntoView(false);
                }                
            }            
        ]
    },
    {
        text: "☖ Highlight all occurrences",
        action: () => {
            let color = getEventElementDataSelectColor();
            let instanceName = contextTarget.getAttribute("title");
            document.querySelectorAll("td.eventElementDataSelect[title='" + instanceName + "']").forEach( row => row.style.backgroundColor = color );
        }
    },
    {
        text: "🗑 Remove all occurrences",
        action: () => {
            let instanceName = contextTarget.getAttribute("title");
            document.querySelectorAll('tr#eventRow').forEach( row => { 
                let eventElement = row.querySelector("td.eventElementDataSelect");
                if(eventElement && eventElement.hasAttribute("title") && eventElement.getAttribute("title") == instanceName)
                    row.remove();
                syncBookmarks();
            });            
        }
    },
    { isDivider: true },
    {
        text: "☖ Copy",
        action: () => {
            let instanceName = contextTarget.getAttribute("title");
            PDT.copyToClipboard(instanceName);
        }
    },
    { isDivider: true }, 
    {
        text: "☓ Close this menu",
        action: () => { /* empty action just closes menu */  } 
    }
];

let contextTarget;

$("div#traceEvent-CONTAINER").on(
    "contextmenu", 
    "td#eventLineNumber", 
    function (evt) {
        evt.preventDefault();
        contextTarget = this;
        ctxmenu.show(menuLineNumberStructure, evt);
}).on(
    "contextmenu", 
    "td#elementInstanceName", 
    function (evt) {
        evt.preventDefault();
        contextTarget = this;
        ctxmenu.show(menuInstanceNameStructure, evt);
});

const eventElementDataSelectColors = ["PeachPuff", "lavender", "PaleGreen", "#C0448f", "#FFFACD", "#E0FFFF", "#FFD700", "#FFE1FF", "#FF8C69"];
let currentColorIndex = 0;

function getEventElementDataSelectColor() {
    let returnColor = eventElementDataSelectColors[currentColorIndex];
    currentColorIndex++;
    if(currentColorIndex == eventElementDataSelectColors.length) {
        currentColorIndex = 0;
    }
    return returnColor;
}
