console.log("PDT: devstudio/devstudio_flow.js");
PDT.setScriptsApplied();

document.arrive("div.gfw-breadcrumbs ul li", {onceOnly: true, existing: true}, () => {
    injectScript("/js/", "injectFlowType.js"); 
});
