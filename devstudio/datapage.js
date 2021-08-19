console.log("devstudio/datapage.js");

var CopyDPCall = function CopyDPCall(nocopy) {
	dpCallString = document.querySelector("span[title='Page Name']").innerText + "[";
	document.querySelectorAll("div[node_name='pzRuleFormParameters'] div#gridBody_right table.gridTable  tr.cellCont").forEach(function (row) {
		if (row.querySelector("input") && row.querySelector("input").value) {
			dpCallString += row.querySelector("input").value + ": \"" + "\", "
		}
	});
	if (dpCallString.endsWith(", ")) dpCallString = dpCallString.substring(0, dpCallString.length - 2);
	dpCallString += "]";
	if(!nocopy) {
		copyToClipboard(dpCallString);

		//let user know 
		var status = document.getElementById('status');
		status.textContent = 'copied';
		setTimeout(function () {
			status.textContent = '';
		}, 750);
	}
    return false;
}

appendScript(copyToClipboard);
appendScript(CopyDPCall);
// var script = document.createElement('script');
// script.textContent = CopyDPCall;
// (document.head || window.documentElement).appendChild(script);

var dpCallString;
CopyDPCall(true);

document.querySelector("div[node_name='pzRuleFormParameters'] h2").insertAdjacentHTML(
	"afterend", 
	'<div>' + dpCallString + ' <a href="#" onclick="return CopyDPCall()"><i class="icons pi pi-copy" id="CopyName" title="Copy to clipboard"></i></a></div><div id="status"></div>'
);
