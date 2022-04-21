console.log("PDT: devstudio/devstudio_rule.js");

var tries = 0;
var mainDiv;

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

//TODO: convert to PDT.settings
function siteConfigCallback(siteConfig, globalConfig) {
	if (! PDT.isDevstudioEnabled()) {
		console.log('PDT DevStudio disabled');
	} else {
		console.log('PDT DevStudio');
        injectScript("/js/", "copyNameClass.js");

        //FEATURE: copy rule info (name, class, ruleset) in a format to be pasted into a table
        if($('a.custom_RuleOpener').eq(0)) {
            $('a.custom_RuleOpener').eq(0).after('<a class="rule-details" style="margin-top:0; margin-bottom:0;padding-bottom: 3px;padding-top: 0;" href="#" onclick="return CopyNameAndClass()" title="Copy name, class and ruleset"><i  class="icons pi pi-copy" id="CopyNameAndClass"></i></a>');
        }
        
        //FEATURE: copy class name
        var classElem = document.querySelector("a[name^='RuleFormHeader']" || document.querySelector("span[tile='Class Name']"))
        if(classElem) {
            classElem.insertAdjacentHTML('afterend', '<a style="margin-top:0; margin-bottom:0;padding-bottom: 3px;padding-top: 0;" href="#" onclick="return CopyClassName()" title="Copy class name"><i  class="icons pi pi-copy" id="CopyClassName"></i></a>');
        } else {
            //TODO: show class name
            //document.querySelector('div#PEGA_HARNESS').getAttribute('classname');
        }
        
        //FEATURE: show button to copy pzInskey to clipboard
        if(PDT.settings.devstudio.copypzinskey) {
            document.querySelectorAll('div[node_name="pzRuleFormKeysAndDescription"] span.workarea_header_titles')[0].insertAdjacentHTML('beforebegin', '<a style="margin-top:0; margin-bottom:0;padding-bottom: 3px;padding-top: 0;" href="#" onclick="return CopypzInsKey()" title="Copy pzInsKey"><i  class="icons pi pi-copy" style="color: white" id="CopypzInsKey"></i></a>')
        }
    }
}

function waitUntilRenderRS() {
    mainDiv =  document.querySelector("a[name^='RuleFormHeader']") || document.querySelector('a.custom_RuleOpener') ;
    if (mainDiv) {
        siteConfig(siteConfigCallback);
    } else {
        tries = tries + 1;
        console.log(tries);
        if (tries > 10) return;
        setTimeout(() => {
            waitUntilRenderRS();
        }, 500);
    }
}

waitUntilRenderRS();
injectSidebarToggle();
injectCloseShortcut();