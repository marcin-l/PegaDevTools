PDT.setScriptsApplied();
console.log("PDT: devstudio/devstudio_function.js");

document.arrive("a.ce-expand", {onceOnly: true, existing: true}, () => {
    injectScript("/js/", "formatJava.js");
    cms.insertAdjacentHTML('beforebegin', '<a class="pretty-print-icon prettyPrintScrollbar" title="Pretty print" onclick="formatJava()"></a>');
});
