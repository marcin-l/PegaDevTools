PDT.setScriptsApplied();
console.log("PDT: devstudio/devstudio_datatransform.js");

document.arrive("div[data-node-id='pzRuleFormRuleset'] div.primary-navigation-links", {onceOnly: true, existing: true}, (selection) => {
    selection.insertAdjacentHTML("beforeend", "&nbsp;<a onclick='copyRuleTableContent()'>Export</a>");
    injectScript("/js/", "copyDataTransform.js");
});
