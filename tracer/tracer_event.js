console.log("PDT: tracer/tracer_event.js");
PDT.setScriptsApplied();

//FEATURE: hide columns
const removeThreadNameButton = $('<span title="Remove column" class="removeColumn">x</span>');
removeThreadNameButton.click(function () { injectStyles('td.EventDataCenter#threadname { display: none}'); $('td.eventTitleBarStyle[title="Thread"]').css('display', 'none'); });
$('td.eventTitleBarStyle[title="Thread"]').append(removeThreadNameButton);

const removeIntBtn = $('<span title="Remove column" class="removeColumn">x</span>');
removeIntBtn.click(function () { injectStyles('div#traceEvent-CONTAINER table td:nth-child(6) { display: none}'); $('td.eventTitleBarStyle[title="Int"]').css('display', 'none'); });
$('td.eventTitleBarStyle[title="Int"]').append(removeIntBtn);

const removeElapsedBtn = $('<span title="Remove column" class="removeColumn">x</span>');
removeElapsedBtn.click(function () { injectStyles('div#traceEvent-CONTAINER table td:nth-child(13) { display: none}'); $('td.eventTitleBarStyle[title="Elapsed"]').css('display', 'none'); });
$('td.eventTitleBarStyle[title="Elapsed"]').append(removeElapsedBtn);

const removeRuleNoBtn = $('<span title="Remove column" class="removeColumn">x</span>');
removeRuleNoBtn.click(function () { injectStyles('div#traceEvent-CONTAINER table td:nth-child(7) { display: none}'); $('td.eventTitleBarStyle[title="Rule#"]').css('display', 'none'); });
$('td.eventTitleBarStyle[title="Rule#"]').append(removeRuleNoBtn);

const removeAllColumnsBtn = $('<div title="Remove all columns" class="removeColumn">X</div>');
removeAllColumnsBtn.click(function () { $('span.removeColumn').click(); $(this).css('display', 'none'); });
$('td.eventTitleBarStyle[title="Line"]').prev().append(removeAllColumnsBtn);

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

            let bookmarksButton = window.parent.frames[0].document.querySelector("div.btnPDTGroup.greyPDT");
            bookmarksButton.classList.remove("initiallyHidden");

            let newTextContent = "Bookmarks";
                if (bookmarksButton.getAttribute("data-count")) {
                    newTextContent = "Bookmarks" + String.fromCharCode(160);
                    newTextContent += "" + document.querySelectorAll("td[data-PDTbookmark]").length;
                }
            bookmarksButton.querySelector("button#btnPDTBookmarks").textContent = newTextContent;

        }
    },    
    { isDivider: true },
    {
        text: "⇑ Remove next events",
        action: () => {
            let eventNumber = parseInt(contextTarget.getAttribute("title"));
            document.querySelectorAll('tr#eventRow').forEach( row => { if(parseInt(row.querySelector("td#eventLineNumber").getAttribute("title")) > eventNumber) row.remove() });
        }
    },
    {
        text: "⇓ Remove previous events",
        action: () => {
            let eventNumber = parseInt(contextTarget.getAttribute("title"));
            document.querySelectorAll('tr#eventRow').forEach( row => { if(parseInt(row.querySelector("td#eventLineNumber").getAttribute("title")) < eventNumber) row.remove() });
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
                    row.remove() 
            });            
        }
    },   
    { isDivider: true }, 
    {
        text: "☓ Close this menu",
        action: () => { /* empty action just closes menu */  } 
    }
];

let contextTarget;

//FEATURE: menus
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