console.log("PDT: devstudio/devstudio_rule.js");

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

var CopyClassName = function CopyClassName() {
    let xml = $('textarea#PRXML').val().replace('<?xml version="1.0" ?>', '').replace("<?xml version='1.0' ?>", "");
    $xml = $($.parseXML(xml));
    let copyText = $xml.find("pyClassName")[0].textContent;
    copyToClipboard(copyText);
    return false;
}

var CopypzInsKey = function CopypzInsKey() {
    let xml = $('textarea#PRXML').val().replace('<?xml version="1.0" ?>', '').replace("<?xml version='1.0' ?>", "");
    $xml = $($.parseXML(xml));
    let copyText = $xml.find("pzInsKey")[0].textContent;
    copyToClipboard(copyText);
    return false;
}


//TODO: open rule class in app explorer
// function openRuleClassInAppExplorer() {
//     showRuleInAppExplorer("Rule-HTML-Section", "RULE-OBJ-CLASS");
// }

// //
// if (document.querySelectorAll("div.dataValueRead span.workarea_header_titles").length > 0)
//     var ruleClassName = document.querySelectorAll("div.dataValueRead span.workarea_header_titles")[0];
// if (ruleClassName) {
//     ruleClassName.insertAdjacentHTML("beforeend", ' <i id="PegaDevToolsRuleDropdownCaret" class="pi pi-caret-down pi-right" ></i><div id="PegaDevToolsRuleDropdown" style="display:none">Show in App Explorer</div>');
//     document.getElementById('PegaDevToolsRuleDropdownCaret').addEventListener('click', function () { toggleElem(document.getElementById('PegaDevToolsRuleDropdown'))});
//     document.getElementById('PegaDevToolsRuleDropdown').addEventListener('click', openRuleClassInAppExplorer);
// }

function siteConfigCallback(siteConfig, globalConfig) {
	if (!globalConfig.settings || (globalConfig.settings && globalConfig.settings.devstudio.disabled)) {
		console.log('PDT DevStudio disabled');
	} else {
		console.log('PDT DevStudio');
        appendScript(copyToClipboard);

        //FEATURE: copy rule info (name, class, ruleset) in a format to be pasted into a table
        if($('a.custom_RuleOpener').eq(0)) {
            appendScript(CopyNameAndClass);
            $('a.custom_RuleOpener').eq(0).after('<a class="rule-details" style="margin-top:0; margin-bottom:0;padding-bottom: 3px;padding-top: 0;" href="#" onclick="return CopyNameAndClass()" title="Copy name, class and ruleset"><i  class="icons pi pi-copy" id="CopyNameAndClass"></i></a>');
        }
        
        //FEATURE: copy class name
        if(document.querySelector("a[name^='RuleFormHeader']")) {
            appendScript(CopyClassName);
            document.querySelector("a[name^='RuleFormHeader']").insertAdjacentHTML('afterend', '<a style="margin-top:0; margin-bottom:0;padding-bottom: 3px;padding-top: 0;" href="#" onclick="return CopyClassName()" title="Copy class name"><i  class="icons pi pi-copy" id="CopyClassName"></i></a>');
        }
        
        //FEATURE: show button to copy pzInskey to clipboard
        if(globalConfig.settings.devstudio.copypzinskey) {
            appendScript(CopypzInsKey);
            document.querySelectorAll('div[node_name="pzRuleFormKeysAndDescription"] span.workarea_header_titles')[0].insertAdjacentHTML('beforebegin', '<a style="margin-top:0; margin-bottom:0;padding-bottom: 3px;padding-top: 0;" href="#" onclick="return CopypzInsKey()" title="Copy pzInsKey"><i  class="icons pi pi-copy" style="color: white" id="CopypzInsKey"></i></a>')
        }
    }
}


siteConfig(siteConfigCallback);