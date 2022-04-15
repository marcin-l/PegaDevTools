//jQuery("div.dialogDataContainer table table table").eq(1).filterTable();

//TODO: make page navigation float on scroll (https://stackoverflow.com/questions/31184298/how-to-float-a-div-on-scroll)

var tries = 0;
var mainDiv;

function waitUntilRender() {
    mainDiv = document.querySelector("div#MainDiv");
    if (mainDiv) {
        addPageNavigation();
        addSearch();
    } else {
        tries = tries + 1;
        console.log(tries);
        if (tries > 10) return;
        setTimeout(() => {
            waitUntilRender();
        }, 500);
    }
}

//sorting based on https://stackoverflow.com/questions/14267781/sorting-html-table-with-javascript by Nick Grealy
const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;
const comparer = (idx) => (a, b) => ((v1, v2) => 
    v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
    )(getCellValue(a, idx), getCellValue(b, idx));

function getMainTable() {  return document.querySelector("div#scrollingDIV table td[valign='TOP'] table tbody tr td table[border='0']"); } 

function sortTopLevel() {
    let mainTable = getMainTable();
    Array.from(mainTable.querySelectorAll(':scope > tbody > tr.eventTable:nth-child(n+2)'))
        .sort(comparer(0))
        .forEach(tr => mainTable.appendChild(tr) );
}

var markNavigatedPage = function markNavigatedPage(e) { 
    document.querySelectorAll("tr.eventTable").forEach(el => el.style.backgroundColor = "#EFEFEF"); //revert highlight
    let eid = e.getAttribute("href"); 
    eid = eid.replaceAll("(", "\\(").replaceAll(")", "\\)"); //escape chars which querySelector doesn't like
    document.querySelector(eid).parentNode.style.backgroundColor = "LightYellow";
} 

function addPageNavigation() {
    if (mainDiv) {
        console.log("PDT tracer_page");
        mainDiv.style.display = "flex";
        let divTag = document.createElement("div");
        divTag.id = "PDT_embeddedPageList";
        divTag.style.maxWidth = "20%";
        mainDiv.prepend(divTag);

        let mainTable = getMainTable();
        // if (!mainTable) {

        //     mainTable = document.querySelector("div#scrollingDIV table td[valign='TOP'] table tbody tr td table[border='0']");
        // }
        if (mainTable) {
            appendScript(markNavigatedPage);

            //TODO: needed?
            mainTable.setAttribute("id", "mainTable");
            //let subHeader = document.querySelector("td.dialogSubHeaderBackground");
            //subHeader.innerHTML = "";

            // //without sorting
            // document.querySelectorAll("table#mainTable > tbody > tr.eventTable > td > table").forEach(function (elem) {
            //     let pelem = elem.parentNode.parentNode.querySelector("td");
            //     pelem.setAttribute("id", "mainPageNode" + pelem.innerText.trim());
            //     let linktag = document.createElement("a");
            //     linktag.innerHTML = pelem.innerText.trim();
            //     linktag.setAttribute("href", "#" + "mainPageNode" + pelem.innerText.trim());
            //     divTag.appendChild(linktag);
            //     divTag.appendChild(document.createElement("br"));
            // })


            //TODO: attempt at sorting the results
            var embeddedPages = mainTable.querySelectorAll(":scope > tbody > tr.eventTable > td > table");
            Array.from(embeddedPages).sort(
                function(a, b) {
                    var textA = a.parentNode.parentNode.querySelector("td").innerText.trim().toUpperCase();
                    var textB = b.parentNode.parentNode.querySelector("td").innerText.trim().toUpperCase();
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                }
            ).forEach(elem => {
                let pelem = elem.parentNode.parentNode.querySelector("td");
                pelem.setAttribute("id", "mainPageNode" + pelem.innerText.trim());
                let linktag = document.createElement("a");
                linktag.innerHTML = pelem.innerText.trim();
                linktag.setAttribute("href", "#" + "mainPageNode" + pelem.innerText.trim());
                linktag.setAttribute("onclick", "markNavigatedPage(this)");
                divTag.appendChild(linktag);
                divTag.appendChild(document.createElement("br"));
            })
        }

    } else {
        return false;
    }
}

function addSearch() {
    $('table#mainTable').filterTable({label:"Search:", placeholder:"properties and values"});
}

if (!waitUntilRender()) {
    console.log("PDT tracer_page: No div#MainDiv");
}

function siteConfigCallback(siteConfig, globalConfig) {
	if (globalConfig.settings && globalConfig.settings.tracer.tracerPageSort) {
		sortTopLevel();
	}
}