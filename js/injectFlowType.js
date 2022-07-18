
if(typeof flowTypeCategory !== 'undefined' && flowTypeCategory !== null) {
    let flowType = flowTypeCategory;
    if(flowType.includes("Standard"))
        flowType = "Standard";
    document.querySelector("div.gfw-breadcrumbs ul li").insertAdjacentHTML("beforeend", "<span style='font-family: OpenSans, sans-serif; font-size: small;'>type: " + flowType + "</span> ");
}

if(document.querySelector("div.gfw-breadcrumbs ul li")) {
    document.querySelector("div.gfw-breadcrumbs ul li").insertAdjacentHTML("beforeend", " <a style='font-family: OpenSans, sans-serif; font-size: small;' id='PDTShowNodeIDs'>Show node IDs</a> ");

    document.querySelector("a#PDTShowNodeIDs").addEventListener("click", () => {
        document.querySelectorAll("div#processFlow_g svg g g[id].typeAssignment, div#processFlow_g svg g g[id].typeUtility, div#processFlow_g svg g g[id].typeFork, div#processFlow_g svg g g[id].typeSubflow").
            forEach((e)=> {
                    let gid = e.getAttribute('id'); 
                    console.log(e.querySelector("tspan").innerText); 
                    e.querySelector("tspan").innerHTML = gid; 
                    e.querySelectorAll("tspan:nth-of-type(n+2)").forEach(e2 => e2.remove());
            });
    })
}

