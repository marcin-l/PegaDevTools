function CopyDPCall(noCopy) {
	let dpCallString = document.querySelector("span[title='Page Name']").innerText + "[";
	document.querySelectorAll("div[node_name='pzRuleFormParameters'] div#gridBody_right table.gridTable  tr.cellCont").forEach(function (row) {
		if (row.querySelector("input") && row.querySelector("input").value) {
			dpCallString += row.querySelector("input").value + ": \"" + "\", "
		}
	});
	if (dpCallString.endsWith(", ")) dpCallString = dpCallString.substring(0, dpCallString.length - 2);
	dpCallString += "]";
	if(!noCopy) {
		copyToClipboard(dpCallString);

		//let user know 
		let status = document.getElementById('status');
		status.textContent = 'copied';
		setTimeout(function () {
			status.textContent = '';
		}, 750);
	}
    return false;
}