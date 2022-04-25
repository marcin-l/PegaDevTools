console.log("PDT: devstudio/devstudio_ruleset.js");

var tries = 0, pagerDiv;
var rsvListObserver;

//TODO: FEATURE: copy ruleset version list pager on top of the list
function copyPagerToTop() {
    PDT.debug("PDT: copyPagerToTop");
    var rsvPagerList = document.querySelectorAll("div[editaction=pzRuleset_ShowRuleSetVersion] div.gridActionBottom");
    if(rsvPagerList.length == 1) {
        PDT.debug("PDT: copyPagerToTop rsvPager found");
        var rsvPager = document.querySelector("div[editaction=pzRuleset_ShowRuleSetVersion] div.gridActionBottom").cloneNode(true);
        var rsvTarget = document.querySelector("div[editaction=pzRuleset_ShowRuleSetVersion]");
        if(rsvTarget) {
            rsvTarget.insertBefore(rsvPager, rsvTarget.firstChild);
            PDT.debug("PDT: copyPagerToTop rsvTarget found");
        }
    } else {
        PDT.debug("PDT: copyPagerToTop rsvPager NOT found");
    }
}

function addRSObserver() {

    //const rsvList = document.querySelector("div[data-node-id='pzRuleSet_ListRuleSetVersions']");
    const rsvList = document.querySelector('div[node_name="pzRuleSet_ListRuleSetVersions"] div.default#PEGA_GRID_SKIN');
    //document.querySelector("div[node_name='pzRuleSet_ListRuleSetVersions']")
    //("table#bodyTbl_right[summary='pyRuleSetVersionsList']");
    //document.querySelector("table[summary='pyRuleSetVersionsList']");

    PDT.debug(rsvList);
    const rsvListCallback = function (mutationsList, observer) {
        PDT.debug("PDT: rsvListCallback ");
        copyPagerToTop();
    };

    rsvListObserver = new MutationObserver(rsvListCallback);
    rsvListObserver.observe(rsvList, {
        childList: true
        //subtree: true
    })
}

function waitUntilRenderRS() {
    pagerDiv = document.querySelector("div[editaction=pzRuleset_ShowRuleSetVersion] div.gridActionBottom a");
    if (pagerDiv) {
        copyPagerToTop();
        addRSObserver();
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
