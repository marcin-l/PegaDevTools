browser = (window.browser)? window.browser : window.chrome;

// Saves options to browser.storage
function saveSiteConfig() {
  let siteConfig = new Array();
  $("div#siteRow").each(function (index, element) {
    let site = $(this).find("input#site")[0].value;
    if(site) {
      let label = $(this).find("input#label")[0].value;
      let useColorTop = $(this).find("input#useColorTop")[0].checked;
      let color = $(this).find("button#color")[0].innerText;
      let version = $(this).find("select#version")[0].value;

      siteConfig.push({ site: site, label: label, color: color, useColorTop: useColorTop, version: version });
    } else {
      $(this).closest("div#siteRow").remove();
    }
  });
  console.log(siteConfig);

  browser.storage.sync.set({
    siteConfig: siteConfig
  }, function () {
    //update status to let user know options were saved
    let status = document.getElementById('status');
    status.textContent = 'Site configuration saved';
    setTimeout(function () {
      status.textContent = '';
    }, 750);
  });
}

function saveSettings() {
  let settings = new Object();
  settings.useSiteLabelForBrowserTitle = document.querySelector("input#useSiteLabelForBrowserTitle").checked;
  settings.hideEnvironmentHeader = document.querySelector("input#hideEnvironmentHeader").checked;
  settings.favicon = document.querySelector("select#favicon").value;
  settings.clipboard = new Object();
  settings.clipboard.split5050 = document.querySelector("input#clipboardSplit5050").checked;
  settings.clipboard.disabled = document.querySelector("input#disableClipboard").checked;
  settings.tracer = new Object();
  settings.tracer.disabled = document.querySelector("input#disableTracer").checked;
  settings.tracer.pagesort = document.querySelector("input#tracerPageSort").checked;
  settings.tracer.settingsFullscreen = document.querySelector("input#tracerSettingsFullscreen").checked;
  settings.tracer.pageMessagesExpand = document.querySelector("input#tracerPageMessagesExpand").checked;
  settings.tracer.openBehavior = (document.querySelector("input[name=tracerOpenBehavior]:checked") ?  document.querySelector("input[name=tracerOpenBehavior]:checked").id : "");

  settings.devstudio = new Object();
  settings.devstudio.disabled = document.querySelector("input#disableDevStudioCustomization").checked;
  settings.devstudio.closeTabMiddleClick = document.querySelector("input#devstudioCloseTabMiddleClick").checked;
  settings.devstudio.expandTabOnHover = document.querySelector("input#devstudioExpandTabOnHover").checked;
  settings.devstudio.hideCloseButton = document.querySelector("input#devstudioHideCloseButton").checked;
  settings.devstudio.longerRuleNames = document.querySelector("input#devstudioLongerRuleNames").checked;
  settings.devstudio.checkoutIndicator = document.querySelector("input#devstudioCheckoutIndicator").checked;

  settings.agilestudio = new Object();
  settings.agilestudio.enabled = document.querySelector("input#enableAgilestudio").checked;

  settings.deploymentmanager = new Object();
  settings.deploymentmanager.enabled = document.querySelector("input#enableDeploymentManager").checked;  

  settings.debug = document.querySelector("input#debug").checked;
  
  console.log(settings);

  browser.storage.sync.set({
    settings: settings
  }, function () {
    let status = document.getElementById('settingsStatus');
    status.textContent = 'Settings saved';
    setTimeout(function () {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences stored in browser.storage
function restore_options() {
  browser.storage.sync.get(["siteConfig", "settings"], function (data) {
    console.log(data);
    $(data.siteConfig).each(function (index, element) {
      addSite();
      $("input#site").eq(index).val(element.site);
      $("button#color").eq(index).text(element.color).css("background-color", "#" + element.color.replace("#", "")).css("color", "transparent");
      $("input#useColorTop").eq(index).prop("checked", element.useColorTop);
      $("input#label").eq(index).val(element.label);
      $("select#version").eq(index).val(element.version);
   });
    
    document.querySelector("input#debug").checked = (data.settings.debug)?data.settings.debug:false;
    document.querySelector("input#useSiteLabelForBrowserTitle").checked = (data.settings.useSiteLabelForBrowserTitle)?data.settings.useSiteLabelForBrowserTitle:"";
    document.querySelector("input#hideEnvironmentHeader").checked = (data.settings.hideEnvironmentHeader)?data.settings.hideEnvironmentHeader:"";
    document.querySelector("select#favicon").value = (data.settings.favicon)?data.settings.favicon:"small";
    document.querySelector("input#clipboardSplit5050").checked = (data.settings.clipboard.split5050)?data.settings.clipboard.split5050:"";
    document.querySelector("input#disableClipboard").checked = (data.settings.clipboard.disabled)?data.settings.clipboard.disabled:"";
    document.querySelector("input#disableTracer").checked = (data.settings.tracer.disabled)?data.settings.tracer.disabled:"";
    document.querySelector("input#tracerPageSort").checked = (data.settings.tracer.pagesort)?data.settings.tracer.pagesort:"";
    document.querySelector("input#tracerSettingsFullscreen").checked = (data.settings.tracer.settingsFullscreen)?data.settings.tracer.settingsFullscreen:"";
    document.querySelector("input#tracerPageMessagesExpand").checked = (data.settings.tracer.settingsFullscreen)?data.settings.tracer.pageMessagesExpand:"";
    //if(data.settings.tracer.openBehavior) document.getElementById(data.settings.tracer.openBehavior).checked = true;

    document.querySelector("input#disableDevStudioCustomization").checked = (data.settings.devstudio.disabled)?data.settings.devstudio.disabled:"";
    document.querySelector("input#devstudioCloseTabMiddleClick").checked = (data.settings.devstudio.closeTabMiddleClick)?data.settings.devstudio.closeTabMiddleClick:"";
    document.querySelector("input#devstudioExpandTabOnHover").checked = (data.settings.devstudio.expandTabOnHover)?data.settings.devstudio.expandTabOnHover:"";    
    document.querySelector("input#devstudioHideCloseButton").checked = (data.settings.devstudio.hideCloseButton)?data.settings.devstudio.hideCloseButton:"";
    document.querySelector("input#devstudioLongerRuleNames").checked = (data.settings.devstudio.longerRuleNames)?data.settings.devstudio.longerRuleNames:"";
    document.querySelector("input#devstudioCheckoutIndicator").checked = (data.settings.devstudio.devstudioCheckoutIndicator)?data.settings.devstudio.devstudioCheckoutIndicator:"";

    document.querySelector("input#enableAgilestudio").checked = (data.settings.agilestudio.enabled)?data.settings.agilestudio.enabled:"";

    document.querySelector("input#enableDeploymentManager").checked = (data.settings.deploymentmanager.enabled)?data.settings.deploymentmanager.enabled:"";

  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('saveSiteConfig').addEventListener('click', saveSiteConfig);
document.getElementById('saveSettings').addEventListener('click', saveSettings);


function addSite() {
  let newOptionsHtml = '<div id="siteRow">'
  newOptionsHtml += '<input id="site" placeholder="domain, without https://"></input>';
  newOptionsHtml += '<input id="label" placeholder="DEV, STG, UAT, etc."></input>';
  newOptionsHtml += '<button id="color" class="color-button" data-huebee>Pick a color</button>';
  newOptionsHtml += '<input id="useColorTop" type="checkbox" /><span class="tooltip helper">?<span class="tooltipText">Show thin color bar at the top of Dev Studio, Tracer and Clipboard</span></span>&nbsp;';
  newOptionsHtml += '<select id="version"><option value="" disabled selected hidden>Version:</option><option value=""></option><option value="7">Pega 7</option><option value="81">Pega 8.1</option><option value="82">Pega 8.2</option><option value="83">Pega 8.3</option><option value="84">Pega 8.4</option><option value="85">Pega 8.5</option><option value="86">Pega 8.6</option><option value="87">Pega 8.7</option><option value="88">Pega 8.8</option></select>';
  newOptionsHtml += '&nbsp;&nbsp;<a href="#" class="siteRem">remove</a></div>';
  $("#siteConfig").append(newOptionsHtml);
  let hueb = new Huebee($("button#color").last()[0], { notation: 'hex', saturations: 1, setBGColor: true, shades: 7, hue0: 80, customColors: [ '#FFF', '#0E0', '#FFA30F', '#C25', '#FFF000', '#19F' ]});
  hueb.on('change', function(color) { //sets text color to chosen color so hex is not visible
    this.anchor.style.color = color;
  });
}

document.getElementById('addSite').addEventListener('click', addSite);

//event delegation
$("div#siteConfig").on("click", "a", function (event) {
  //event.preventDefault();
  $(this).closest("div#siteRow").remove();
});
