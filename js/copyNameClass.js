function CopyNameAndClass() {
    let xml = $('textarea#PRXML').val().replace('<?xml version="1.0" ?>', '').replace("<?xml version='1.0' ?>", "");
    $xml = $($.parseXML(xml));
    let copyText = $xml.find("pyRuleName")[0].textContent;
    copyText = copyText + ' \t' + $xml.find("pyClassName")[0].textContent;
    copyText = copyText + ' \t' + $xml.find("pyRuleSet")[0].textContent;
    if (!$xml.find("pyRuleSet")[0].textContent.includes("Branch"))
        copyText = copyText + ' [' + $xml.find("pyRuleSetVersion")[0].textContent + ']';

    copyToClipboard(copyText);
    return false;
}

function CopyClassName() {
    let xml = $('textarea#PRXML').val().replace('<?xml version="1.0" ?>', '').replace("<?xml version='1.0' ?>", "");
    $xml = $($.parseXML(xml));
    let copyText = $xml.find("pyClassName")[0].textContent;
    copyToClipboard(copyText);
    return false;
}

function CopypzInsKey() {
    let xml = $('textarea#PRXML').val().replace('<?xml version="1.0" ?>', '').replace("<?xml version='1.0' ?>", "");
    $xml = $($.parseXML(xml));
    let copyText = $xml.find("pzInsKey")[0].textContent;
    copyToClipboard(copyText);
    return false;
}

function copyToClipboard(textContent) {
	// create hidden text element, if it doesn't already exist
	var targetId = "_hiddenCopyText_";
	var target = document.createElement("textarea");
	target.style.position = "absolute";
	target.style.left = "-9999px";
	target.style.top = "0";
	target.id = targetId;
	document.body.appendChild(target);
	target.textContent = textContent;

	// select the content
	var currentFocus = document.activeElement;
	target.focus();
	target.setSelectionRange(0, target.value.length);

	// copy the selection
	var succeed;
	try {
		succeed = document.execCommand("copy");
	} catch (e) {
		succeed = false;
	}
	// restore original focus
	if (currentFocus && typeof currentFocus.focus === "function") {
		currentFocus.focus();
	}

	target.textContent = "";
	return succeed;
};