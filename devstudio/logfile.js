console.log("PDT: devstudio/logFile.js");

//if last page then scroll to bottom
if(document.querySelector("div#LogContentDiv > div b.page").nextElementSibling === null) {
    window.scrollTo(0, document.body.scrollHeight);
}

var pager = document.querySelector("div#LogContentDiv > div").cloneNode(true);
var target = document.querySelector("div#LogContentDiv");
if(target) {
    target.insertBefore(pager, target.firstChild);
}
