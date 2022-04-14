console.log("PDT: devstudio/devstudio_function.js");


var cms = document.querySelector("a.ce-expand");
if(cms) {
    injectScript("/js/", "formatJava.js");
    cms.insertAdjacentHTML('beforebegin', '<a class="pretty-print-icon prettyPrintScrollbar" title="Pretty print" onclick="formatJava()"></a>');
}
