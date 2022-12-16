//activity pzUpdateClipboardFromPRXML

function copyRuleTableContent() {
    let arrOfArr = [];
    let arrOfRow = [];
    arrOfRow.push("");

    document.querySelector("table#bodyTbl_right")
            .querySelectorAll("tr.cellCont th")
            .forEach((head) => {
                if (head.innerText.trim()) 
                    arrOfRow.push(head.innerText);
    });

    arrOfArr.push(arrOfRow);

    let plIndex = 0;

    document.querySelector("table#bodyTbl_right")
            .querySelectorAll("tr.cellCont")
            .forEach((elem, index) => {
                arrOfRow = [];

                if(elem.hasAttribute("pl_index")) {
                    if(parseInt(elem.getAttribute("pl_index")) <= plIndex) {
                        arrOfRow.push(plIndex + "." + elem.getAttribute("pl_index"));
                    } else {
                        plIndex = parseInt(elem.getAttribute("pl_index"));
                        arrOfRow.push(plIndex);
                    }
                } else {
                    arrOfRow.push("");
                }

                elem.querySelectorAll("td input:not([type='hidden']), td option[selected]")
                    .forEach((subElem) => {
                        arrOfRow.push(subElem.value || subElem.innerText);
                    });
                if (index > 0) 
                    arrOfArr.push(arrOfRow);
        });

    let outData = arrOfArr.map(lines => lines.join("\t"))
        .join("\n");

    copyToClipboard(outData);
}