//activity pzUpdateClipboardFromPRXML

function copyRuleTableContent() {

    let arrOfArr = [];
    let arrOfRow = [];

    arrOfRow.push("");

    document
        .querySelector("table#bodyTbl_right")
        .querySelectorAll("tr.cellCont th")
        .forEach((head) => {
            if (head.innerText.trim()) 
                arrOfRow.push(head.innerText);
        });

    arrOfArr.push(arrOfRow);

    let indexSkipped = 0;
    let indexList = document.querySelectorAll("table#bodyTbl_gbl div.dataValueRead");

    document
        .querySelector("table#bodyTbl_right")
        .querySelectorAll("tr.cellCont")
        .forEach((elem, index) => {
            arrOfRow = [];

            if(elem.hasAttribute("pl_index")) {
                arrOfRow.push(indexList[index-indexSkipped].innerText);
            } else {
                arrOfRow.push("");
                indexSkipped++;
            }

            elem
                .querySelectorAll("td input:not([type='hidden']), td option[selected]")
                .forEach((subElem) => {
                    arrOfRow.push(subElem.value || subElem.innerText);
                });
            if (index > 0) 
                arrOfArr.push(arrOfRow);
        });

    var outData = arrOfArr
        .map(lines => lines.join("\t"))
        .join("\n");

    outData = outData.replaceAll("APPLY_MODEL", "APPLY DT").replaceAll("EXIT_MODEL", "EXIT DT").replaceAll("<blank>", "");

    copyToClipboard(outData);
}