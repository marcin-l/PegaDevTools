if(window.location.href.includes("agilestudio")) {

    console.log("agilestudio.js");

    if (PDT.isAgilestudioEnabled()) {
            //inject script which will apply it for newly opened tabs
            injectScript("/js/", "closeTabMiddleClick.js");
            
            PDT.alterFavicon(false, "AS", "#088488");
    }
}