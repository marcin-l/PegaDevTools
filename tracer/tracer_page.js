//jQuery("div.dialogDataContainer table table table").eq(1).filterTable();

//TODO: make page navigation float on scroll (https://stackoverflow.com/questions/31184298/how-to-float-a-div-on-scroll)

var tries = 0;
var mainDiv;

function waitUntilRender() {
    mainDiv = document.querySelector("div#MainDiv");
    if (mainDiv) {
        addPageNavigation();
    } else {
        tries = tries + 1;
        console.log(tries);
        if (tries > 10) return;
        setTimeout(() => {
            waitUntilRender();
        }, 500);
    }
}

function addPageNavigation() {
    if (mainDiv) {
        console.log("PDT tracer_page");
        mainDiv.style.display = "flex";
        let divTag = document.createElement("div");
        divTag.id = "PDT_embeddedPageList";
        divTag.style.maxWidth = "100px";
        mainDiv.prepend(divTag);

        let mainTable = document.querySelector("div#scrollingDIV table td[valign='TOP'] table tbody tr td table[border='0']");
        // if (!mainTable) {

        //     mainTable = document.querySelector("div#scrollingDIV table td[valign='TOP'] table tbody tr td table[border='0']");
        // }
        if (mainTable) {
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
            var embeddedPages = document.querySelectorAll("table#mainTable > tbody > tr.eventTable > td > table");
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
                divTag.appendChild(linktag);
                divTag.appendChild(document.createElement("br"));
            })
        }

    } else {
        return false;
    }
}

if (!waitUntilRender()) {
    console.log("PDT tracer_page: No div#MainDiv");
}