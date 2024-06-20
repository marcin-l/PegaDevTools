console.log("PDT: tracer_page");

let isExpandedSQL = false;

document.arrive("div#MainDiv", {onceOnly: true, existing: true}, () => 	{
    if(getMainTable()) {
        addPageNavigation();
        addSearch();
	    injectScript("/js/", "expandTracerMessagesOnLoad.js");
    } else {
        //FEATURE: full SQL query
        let sql = "", inserts = "", insertsRow;

        for (let tr of document.querySelectorAll("div.dialogDataContainer tr.eventTable")) {
            if (tr.children[0].textContent.trim() == "SQL") {
                sql = tr.children[1].textContent.trim();
            } else if (tr.children[0].textContent.trim() == "SQL Inserts") {
                inserts = tr.children[1].textContent.trim();
                insertsRow = tr;
            }
        }
        
        if(sql && inserts) {
            
            let fullSQL = prepareSQL(sql, inserts, isExpandedSQL);
            if(fullSQL) {
                let fullSQLElement = document.createElement('td');
                fullSQLElement.colSpan = 2;
                fullSQLElement.style.border = "thin solid black";
                fullSQLElement.style.padding = "4px";
                fullSQLElement.style.fontFamily = "monospace";
                fullSQLElement.innerHTML = fullSQL;              
				
				let expandButtonRow = document.createElement('tr');
				let expandButtonCell = document.createElement('td');
				expandButtonCell.colSpan = 2;
				
				let expandButton = document.createElement('button');
				expandButton.id = "sqlExpandButton";
				expandButton.textContent = "Expand";
				expandButton.onclick = function() {
					isExpandedSQL = !isExpandedSQL;
					if(isExpandedSQL)
						document.getElementById("sqlExpandButton").textContent = "Collapse";
					else
						document.getElementById("sqlExpandButton").textContent = "Expand";
					let expandedSQL = prepareSQL(sql, inserts, isExpandedSQL);
					if (expandedSQL) {
						fullSQLElement.innerHTML = expandedSQL;
					}
                    fullSQLElement.scrollIntoView({ behavior: 'smooth' });
				};
				expandButtonRow.appendChild(expandButtonCell);
				expandButtonCell.appendChild(expandButton);
				insertsRow.insertAdjacentElement("afterend", expandButtonRow);
				insertsRow.insertAdjacentElement("afterend", fullSQLElement);
			}
        }
    }
});

//sorting based on https://stackoverflow.com/questions/14267781/sorting-html-table-with-javascript by Nick Grealy
const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;
const comparer = (idx) => (a, b) => ((v1, v2) => 
    v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
    )(getCellValue(a, idx), getCellValue(b, idx));

function getMainTable() {  return document.querySelector("div#scrollingDIV table td[valign='TOP'] table tbody tr td table[border='0']"); } 

function sortTopLevel() {
    let mainTable = getMainTable();
    if(mainTable) {
    	Array.from(mainTable.querySelectorAll(':scope > tbody > tr.eventTable:nth-child(n+2)'))
        	.sort(comparer(0))
        	.forEach(tr => mainTable.appendChild(tr) );
	}
}

function addPageNavigation() {
    let mainDiv = document.querySelector("div#MainDiv");
    mainDiv.style.display = "flex";
    let divTag = document.createElement("div");
    divTag.id = "PDT_embeddedPageList";
    divTag.style.minWidth = "15%";
    divTag.style.maxWidth = "20%";
    mainDiv.prepend(divTag);

    let mainTable = getMainTable();
    if (mainTable) {
        injectScript("/js/", "tracerMarkNavigatedPage.js");

        //let subHeader = document.querySelector("td.dialogSubHeaderBackground");
        //subHeader.innerHTML = "";

        //FEATURE: add navigation link
        let embeddedPages = mainTable.querySelectorAll(":scope > tbody > tr.eventTable > td > table");
        Array.from(embeddedPages).sort(
            function(a, b) {
                let textA = a.parentNode.parentNode.querySelector("td").innerText.trim().toUpperCase();
                let textB = b.parentNode.parentNode.querySelector("td").innerText.trim().toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            }
        ).forEach(elem => {
            let pElem = elem.parentNode.parentNode.querySelector("td");
			let pElemText = pElem.innerText.trim();
            //FEATURE: skip list items with index > 1, only one link representing the list will be shown for clarity
			if(pElemText.endsWith(")") && !pElemText.endsWith("(1)")) {
				return;
            }		

            pElem.setAttribute("id", "mainPageNode" + pElemText);
            let linkTag = document.createElement("a");         
            linkTag.setAttribute("href", "#" + "mainPageNode" + pElem.innerText.trim());
            linkTag.setAttribute("onclick", "markNavigatedPage(this)");
			if(pElemText.endsWith("(1)")) {
				pElemText = pElemText.replace("(1)", "()");
            }
            linkTag.setAttribute("title", pElemText);
            linkTag.innerHTML = pElemText;
            divTag.appendChild(linkTag);
            divTag.appendChild(document.createElement("br"));
        })
        console.log("PDT tracer_page: navigation added");

        //FEATURE: make page navigation float
        //TODO: Ugly. Copies navigation div as a transparent placeholder to keep width and sets navigation position as fixed. Needs a nice CSS solution.
        let divTagClone = divTag.cloneNode(true);
        divTagClone.id = "PDT_placeholder";
        divTagClone.classList.add("PegaDevToolsTransparent");
        divTag.style.setProperty("position", "fixed");
        mainDiv.prepend(divTagClone);
    }
}

//FEATURE: search
function addSearch() {
    function createSearchBox(table) {
        let searchBox = document.createElement('input');
        searchBox.type = 'text';
        searchBox.placeholder = 'properties and values';
        searchBox.onkeyup = function() {
          let searchText = searchBox.value.toLowerCase().trim();
          let rows = table.getElementsByTagName('tr');
          for (let i = 1; i < rows.length; i++) {
            let row = rows[i];
            let cells = row.getElementsByTagName('td');
            let found = false;
            for (let cell of cells) {
                if (cell.innerHTML.toLowerCase().indexOf(searchText) > -1) {
                    found = true;
                    break;
                }
            }
            if (found) {
              row.style.display = '';
            } else {
              row.style.display = 'none';
            }
          }
        };

        return searchBox;
      }
    
    let mainTable = getMainTable();
    if (mainTable) {
        let searchBox = createSearchBox(mainTable);
        let searchBoxWithLabel = document.createElement('p');
        searchBoxWithLabel.id = "PDTSearchBox";
        searchBoxWithLabel.innerHTML = 'Search: ';
        searchBoxWithLabel.appendChild(searchBox);
        mainTable.insertAdjacentElement("beforebegin", searchBoxWithLabel);
        document.arrive("p#PDTSearchBox", {onceOnly: true, existing: true}, () => {
            searchBox.focus();
        });
    }
}

function prepareSQL(sql, inserts, expand = false) {
    //regex would be much nicer
    // function sanitize(inText) {
    //     if(inText.includes("< ") || inText.includes(" >")) {
    //         inText = inText.replace("< ", "<").replace(" >", ">");
    //         return(sanitize(inText));
    //     }
    //     return inText;
    // }

    // inserts = sanitize(inserts);
    // inserts = inserts.replaceAll("<", "'").replaceAll(">", "'").trim();

    // let insertsSplit = inserts.split(" ");

    inserts = inserts.replaceAll("> <", ">\t<").trim();;
    inserts = inserts.replaceAll("<", "'").replaceAll(">", "'");
    let insertsSplit = inserts.split("\t");
    // for (let i = 0; i < insertsSplit.length; i++) {
    //     insertsSplit[i] = insertsSplit[i].replace("<", "").replace(">", "");
    // }
    let sqlSplit = sql.split("?");
    let resultSql = "";
    for (let i = 0; i < sqlSplit.length - 1; i++) {
        resultSql += sqlSplit[i] + "<b>" + insertsSplit[i] + "</b>";
    }
    resultSql += sqlSplit[sqlSplit.length - 1];

    resultSql = resultSql.replaceAll("''null''", "NULL");
	
	if(expand) {        
		resultSql = resultSql.replace(/ FROM /g, "<br>FROM ")
			.replace(/ WHERE /g, "<br>WHERE ")
			.replace(/ LEFT JOIN /g, "<br>LEFT JOIN ")
			.replace(/ RIGHT JOIN /g, "<br>RIGHT JOIN ")
			.replace(/ INNER JOIN /g, "<br>INNER JOIN ")
			.replace(/ OUTER JOIN /g, "<br>OUTER JOIN ")
			.replace(/ GROUP BY /g, "<br>GROUP BY ")
			.replace(/ ORDER BY /g, "<br>ORDER BY ")
			.replace(/ AND /g, "<br>AND ")
			.replace(/ OR /g, "<br>OR ")
			.replace(/ UNION ALL /g, "<br>UNION ALL ")
			.replace(/ UNION /g, "<br>UNION ")
			.replace(/ ON /g, "<br>ON ")
			.replace(/ \(SELECT /g, "<br>(SELECT ")
			.replace(/ \( SELECT /g, "<br>(SELECT ")		
			.replace(/ With /gi, "With<br> ")		
			.replace(/, /g, ",<br>");
	}		

	injectStyles(`.sql-keyword { font-weight: bold; color: navy; }`);
	const sqlKeywords = ["SELECT", "FROM", "WHERE", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "OUTER JOIN", "GROUP BY", "ORDER BY", "AND", "OR", "UNION ALL", "UNION", "ON", "AS", "IN", "NOT", "ROW_NUMBER", "OVER", "PARTITION BY", "CAST", "Date_Part", "ASC", "DESC", "With", "WITH", "RANK", "DENSE_RANK"];
	sqlKeywords.forEach(keyword => {
		const regex = new RegExp(`\\b${keyword}\\b`, 'g');
		resultSql = resultSql.replace(regex, `<span class="sql-keyword">${keyword}</span>`);
	});	

					 
    return resultSql;
}

//TODO: convert to PDT settings
function siteConfigCallback(siteConfig, globalConfig) {
	if (! PDT.isTracerEnabled()) {
		console.log('PDT tracer disabled');
	} else {      
        document.arrive("div#MainDiv", {onceOnly: true, existing: true}, () => 	{
            if(getMainTable()) {
                //FEATURE: Sort properties alphabetically in page view
                if (globalConfig.settings.tracer.pagesort) {
                    sortTopLevel();
                }

                //FEATURE: Always expand step page messages 
                if (globalConfig.settings.tracer.pageMessagesExpand) {
                    injectScript("/js/", "expandTracerMessagesOnLoad.js");
                }
            }
        });
	}
}

siteConfig(siteConfigCallback);