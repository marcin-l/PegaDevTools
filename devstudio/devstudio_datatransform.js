console.log("PDT: devstudio/devstudio_datatransform.js");


var selection = document.querySelector("div[data-node-id='pzRuleFormRuleset'] div.primary-navigation-links");
if(selection) {
    selection.insertAdjacentHTML("beforeend", "<a onclick='copyRuleTableContent()'>Export</a>");
    injectScript("/js/", "copyDataTransform.js");
}
