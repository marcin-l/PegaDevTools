function PDTreplaceText(strOld, strNew) {
	let changeCount = 0;
	document
		.querySelectorAll("input.InputIntellisenseStyle")
		.forEach(function (node) {
			if (node.value.includes(strOld)) {
				node.value = node.value.replace(strOld, strNew);
				changeCount++;
			}
		});
	console.log("PDTreplaceText: " + changeCount + " changes made");
    return changeCount;
}