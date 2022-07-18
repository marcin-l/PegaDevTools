if(window.location.href.includes("devops")) {

    console.log("deploymentmanager.js");

    if (PDT.isDeploymentManagerEnabled()) {
        PDT.alterFavicon(false, "DM", "#7C2424");
    } else {
        console.log("deploymentmanager.js not in DM");
    }
}