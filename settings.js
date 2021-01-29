window.browser = (function () {
  return window.msBrowser ||
    window.browser ||
    window.chrome;
})();

// Saves options to browser.storage
function saveSiteConfig() {
  let siteConfig = new Array();
  $("div#siteRow").each(function (index, element) {
    var site = $(this).find("input#site")[0].value;
    var label = $(this).find("input#label")[0].value;
    var useColorTop = $(this).find("input#useColorTop")[0].checked;
    var color = $(this).find("button#color")[0].innerText;
    var version = $(this).find("select#version")[0].value;

    siteConfig.push({ site: site, label: label, color: color, useColorTop: useColorTop, version: version });
  });
  console.log(siteConfig);

  window.browser.storage.sync.set({
    siteConfig: siteConfig
  }, function () {
    // Update status to let user know options were saved
    var status = document.getElementById('status');
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
  console.log(settings);

  window.browser.storage.sync.set({
    settings: settings
  }, function () {
    var status = document.getElementById('settingsStatus');
    status.textContent = 'Settings saved';
    setTimeout(function () {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences stored in browser.storage
function restore_options() {
  window.browser.storage.sync.get(["siteConfig", "settings"], function (data) {
    console.log(data);
    $(data.siteConfig).each(function (index, element) {
      addSite();
      $("input#site").eq(index).val(element.site);
      $("button#color").eq(index).text(element.color).css("background-color", "#" + element.color);
      $("input#useColorTop").eq(index).prop("checked", element.useColorTop);
      $("input#label").eq(index).val(element.label);
      $("select#version").eq(index).val(element.version);
    });
    document.querySelector("input#useSiteLabelForBrowserTitle").checked = (data.settings.useSiteLabelForBrowserTitle)?data.settings.useSiteLabelForBrowserTitle:"";
    document.querySelector("input#hideEnvironmentHeader").checked = data.settings.hideEnvironmentHeader;
    
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('saveSiteConfig').addEventListener('click', saveSiteConfig);
document.getElementById('saveSettings').addEventListener('click', saveSettings);


function addSite() {
  var newOptionsHtml = '<div id="siteRow">'
  newOptionsHtml += '<input id="site" placeholder="domain"></input>';
  newOptionsHtml += '<input id="label" placeholder="DEV, STG, UAT"></input>';
  newOptionsHtml += '<button id="color" class="jscolor">Pick a color</button>';
  newOptionsHtml += '<input id="useColorTop" type="checkbox"></input>';
  newOptionsHtml += '<select id="version"><option value="" disabled selected hidden>Select</option><option value=""></option><option value="7">Pega 7</option><option value="81">Pega 8.1</option><option value="82">Pega 8.2</option><option value="83">Pega 8.3</option><option value="84">Pega 8.4</option><option value="85">Pega 8.5</option></select>';
  newOptionsHtml += '&nbsp;<a href="#">remove</a></div>';
  $("#siteConfig").append(newOptionsHtml);
  jscolor.installByClassName('jscolor');
}

document.getElementById('addSite').addEventListener('click', addSite);

//event delegation
$("div#siteConfig").on("click", "a", function (event) {
  //event.preventDefault();
  $(this).closest("div#siteRow").remove();
});