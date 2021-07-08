window.browser = (function () {
    return window.msBrowser ||
        window.browser ||
        window.chrome;
})();


if ($('body[class^="channels-express"] div[data-node-id="pzRuntimeToolsTopBar"] div.layout-content-pz-inline-middle').length) {
    //change order to match Dev Studio
    var tracerRef = $('div[data-node-id="pzRuntimeToolsTopBar"] div.layout-content-pz-inline-middle div:has(i.pi-tracer)');
    $('div[data-node-id="pzRuntimeToolsTopBar"] div.layout-content-pz-inline-middle div:has(i.pi-clipboard)').before(tracerRef);

    //add text
    $('div[data-node-id="pzRuntimeToolsTopBar"] div.layout-content-pz-inline-middle div:has(i.pi-tracer) button').append("Tracer");
    $('div[data-node-id="pzRuntimeToolsTopBar"] div.layout-content-pz-inline-middle div:has(i.pi-clipboard) button').append("Clipboard");
    $('div[data-node-id="pzRuntimeToolsTopBar"] div.layout-content-pz-inline-middle div:has(i.pi-inspect) button').append("Live UI");
}

var copyToClipboard = function copyToClipboard(textContent) {
    // create hidden text element, if it doesn't already exist
    var targetId = "_hiddenCopyText_";
    var target = document.createElement("textarea");
    target.style.position = "absolute";
    target.style.left = "-9999px";
    target.style.top = "0";
    target.id = targetId;
    document.body.appendChild(target);
    target.textContent = textContent;

    // select the content
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);

    // copy the selection
    var succeed;
    try {
        succeed = document.execCommand("copy");
    } catch (e) {
        succeed = false;
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
    }

    target.textContent = "";
    return succeed;
}

function appendScript(appendedScript) {
    var script = document.createElement('script');
    script.textContent = appendedScript;
    (document.head || window.documentElement).appendChild(script);
}

function injectScript(aBasePath, aScriptURL) {
    var scriptEl = document.createElement("script");
    scriptEl.src = aBasePath + aScriptURL;
    scriptEl.async = false;

    (document.body || document.head || document.documentElement).appendChild(scriptEl);
}

function extractClassName(sinput) {
    if (sinput) {
        var idx = sinput.indexOf('(');
        sinput = sinput.substring(idx != -1 ? idx + 1 : 0);
        if (sinput[sinput.length - 1] === ')')
            sinput = sinput.substring(0, sinput.length - 1);
        if (sinput.includes('Work-'))
            sinput = sinput.split('Work-')[1];
        else if (sinput.includes('Assign-'))
            sinput = sinput.split('Assign-')[1];
        return sinput;
    }
}

// Show an element
var showElem = function (elem) {
    elem.style.display = 'block';
};

var hideElem = function (elem) { //hide an element
    elem.style.display = 'none';
};

var toggleElem = function (elem) { //toggle element visibility
    if (window.getComputedStyle(elem).display === 'block') { //if the element is visible, hide it
        hide(elem);
        return;
    }
    show(elem);//otherwise show it
};

function injectStyles(rule) {
    $("<div />", {
        //html: '&shy;<style>' + rule + '</style>'
        html: '<style>' + rule + '</style>'
    }).appendTo("body");
}


function replaceInnerHTML(elem, html) {
    const parser = new DOMParser()
    const parsed = parser.parseFromString(html, `text/html`)
    elem.appendChild(parsed);
}

function siteConfig(callback) {
    //get label and color config
    window.browser.storage.sync.get(["siteConfig", "settings"],
        (data) => {
            console.log(data);
            //find config for current url
            var configForSiteFound = false;
            for(let i = 0; i < data.siteConfig.length; i++) {
                if (window.location.href.includes(data.siteConfig[i].site)) {
                    callback(data.siteConfig[i], data);
                    configForSiteFound = true;
                    break;
                }                
            }
            if(configForSiteFound == false)
                callback(null, data);
            // $(data.siteConfig).each(function (index, site) {
            //     if (window.location.href.includes(site.site)) {
            //         callback(site, data);
            //     }
            // });
        });
}

//TODO: ugly, try not to use it
function sleep(milliseconds) {
    var start = new Date().getTime();
    while (new Date() < start + milliseconds) { }
    return 0;
}

function isInDevStudio() {
    //NOTE: ugly but works
    return (document.querySelector("span#TABANCHOR span.textIn, span#TABANCHOR[tabtitle='Home']") && document.querySelector("span#TABANCHOR span.textIn, span#TABANCHOR[tabtitle='Home']").innerText == "Home");
    //TODO: get Pega api object 
    // if(pega.desktop.support.isInDesignerDesktop)
    //     return pega.desktop.support.isInDesignerDesktop();
}