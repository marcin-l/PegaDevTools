console.log("PDT: devstudio/datapage.js");


//appendScript(copyToClipboard);
injectScript("/js/", "CopyDPCall.js");

//same as CopyDPCall.js
let dpCallString = document.querySelector("span[title='Page Name']").innerText + "[";
document.querySelectorAll("div[node_name='pzRuleFormParameters'] div#gridBody_right table.gridTable  tr.cellCont").forEach(function (row) {
	if (row.querySelector("input") && row.querySelector("input").value) {
		dpCallString += row.querySelector("input").value + ": \"" + "\", "
	}
});
if (dpCallString.endsWith(", ")) dpCallString = dpCallString.substring(0, dpCallString.length - 2);
dpCallString += "]";

document.querySelector("div[node_name='pzRuleFormParameters'] h2").insertAdjacentHTML(
	"afterend", 
	'<div>' + dpCallString + ' <a href="#" onclick="return CopyDPCall()"><i class="icons pi pi-copy" id="CopyName" title="Copy to clipboard"></i></a></div><div id="status"></div>'
);
