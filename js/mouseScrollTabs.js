function scrollHorizontally(e) {
    e.currentTarget.scrollLeft -= e.wheelDelta;
    e.preventDefault();
}

let tabListContainer = document.querySelector("div.dc-header div.pegaTabGrp  div.tStrCntr");
if (tabListContainer && tabListContainer.addEventListener) {
    tabListContainer.addEventListener('wheel', scrollHorizontally, false);
} 
  
console.log("PDT: mouseScrollTabs.js loaded"); 