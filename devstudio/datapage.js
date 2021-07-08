console.log("devstudio/datapage.js");

var dpCallString = document.querySelector("span[title='Page Name']").innerText + "[";
document.querySelectorAll("div[node_name='pzRuleFormParameters'] div#gridBody_right table.gridTable  tr.cellCont").forEach(function (row) {
	if (row.querySelector("input") && row.querySelector("input").value) {
		dpCallString += row.querySelector("input").value + ": \"" + "\", "
	}
});
if (dpCallString.endsWith(", ")) dpCallString = dpCallString.substring(0, dpCallString.length - 2);
dpCallString += "]";


document.querySelector("div[node_name='pzRuleFormParameters'] h2").insertAdjacentHTML("afterend", "<div>" + dpCallString + "</div>");
