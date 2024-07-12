console.log("PDT: devstudio/devstudio_datatransform.js");

document.arrive("div[data-node-id='pzRuleFormRuleset'] div.primary-navigation-links", {onceOnly: true, existing: true}, (selection) => {
    selection.insertAdjacentHTML("beforeend", "&nbsp;<a onclick='copyRuleTableContent()'>Export</a>");
    injectScript("/js/", "copyDataTransform.js");
});



PDT.settings().then(settings => {
    if (settings?.devstudio?.datatransform?.moveSuperclassToTop) {
        let superclassElem = document.querySelector('div.content-layout input[type="checkbox"][name*="CallSuperClassMode"]').closest("div.content-layout")
        let target = document.querySelector("table#bodyTbl_right").closest("div.content-item.content-layout.item-1");

        if(target) {
            target.parentNode.insertBefore(superclassElem, target);
        }

    
    }

});