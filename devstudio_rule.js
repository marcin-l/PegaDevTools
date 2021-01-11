var copyToClipboard = function copyToClipboard(textContent) {
    // create hidden text element, if it doesn't already exist
    var targetId = "_hiddenCopyText_";
    var origSelectionStart, origSelectionEnd;
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
}

var CopyNameAndClass = function CopyNameAndClass() {
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

var script = document.createElement('script');
script.textContent = copyToClipboard;
(document.head || window.documentElement).appendChild(script);
script = document.createElement('script');
script.textContent = CopyNameAndClass;
(document.head || window.documentElement).appendChild(script);

$('a.custom_RuleOpener').eq(0).after('<a class="rule-details" style="margin-top:0; margin-bottom:0;padding-bottom: 3px;padding-top: 0;" href="#" onclick="return CopyNameAndClass()"><i  class="icons pi pi-copy" id="CopyNameAndClass" alt="Copy name and class"></i></a>');