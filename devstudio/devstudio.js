console.log("PDT: devstudio/devstudio.js");

(function ($) {})(jQuery);

//TODO: FEATURE: copy ruleset version list pager on top of the list
//observer needed?
var rsvPager = jQuery(
  "div[editaction=pzRuleset_ShowRuleSetVersion] div.gridActionBottom"
);
if (rsvPager) {
  jQuery("div[editaction=pzRuleset_ShowRuleSetVersion]").prepend(rsvPager);
}

function applyPDTCustomization() {
  function siteConfigCallback(siteConfig, globalConfig) {
    if (siteConfig && siteConfig.label) {
      if (
        globalConfig.settings &&
        globalConfig.settings.useSiteLabelForBrowserTitle
      ) {
        var newTitle = siteConfig.label + " Pega";
        if (siteConfig.version)
          newTitle +=
            " " +
            siteConfig.version.slice(0, 1) +
            "." +
            siteConfig.version.slice(1, 2);
        parent.document.title = newTitle;
      }

	  //FEATURE: environment header
      var productionEnvElement = document.querySelector(
        "div[data-ui-meta*='D_pzGetCurrentSystemRecord.pyActiveProductionLevelName']"
      );
      if (productionEnvElement) {
        productionEnvElement.insertAdjacentHTML(
          "afterend",
          "<div style='color: white; text-shadow: black 0px 0px 6px;background-color:#" +
            siteConfig.color.replace("#", '') +
            ";border:2px solid;border-top-style:none; border-right-style:none;margin: 0 0 4px 0;font-weight: bold;border-color:#" +
            siteConfig.color.replace("#", '') +
            "; padding:6px'>" +
            siteConfig.label +
            "</ div>"
        );
        productionEnvElement.closest(
          'div[bsimplelayout="true"]'
        ).style.paddingRight = "0";
      } else {
        document
          .querySelector("div#PegaDevToolsSearchAllOptionsLink")
          .insertAdjacentHTML(
            "beforebegin",
            "<div style='color:#" +
              siteConfig.color.replace("#", '') +
              ";border:2px solid; margin:inherit;margin-right: 7px;padding:3px'>" +
              siteConfig.color.replace("#", '') +
              "</ div>"
          );
      }

      if (
        globalConfig.settings &&
        globalConfig.settings.hideEnvironmentHeader
      ) {
        if (productionEnvElement) productionEnvElement.style.display = "none";
      }

      if (siteConfig.useColorTop) {
        document.querySelector(
          'div[data-portalharnessinsname="Data-Portal-DesignerStudio!pzStudio"]'
        ).style.cssText =
          "border-top: 2px; border-top-style: solid; border-color: #" +
          siteConfig.color.replace("#", '');
      }
    }

    if (globalConfig && globalConfig.settings) {
      var settings = globalConfig.settings;
    }
    if (!settings || (settings && settings.devstudio.disabled)) {
      console.log("PDT DevStudio disabled");
    } else {
      if (settings.tracer) {
        //FEATURE: open tracer in tab
        if (settings.tracer.openBehavior)
          alterTracerOpenBehavior(settings.tracer.openBehavior);
      }

      if (settings.devstudio) {
        //FEATURE: hide close button
        if (settings.devstudio.hideCloseButton)
          injectStyles("div.tStrCntr ul #close {display: none}");

        if (settings.devstudio.longerRuleNames) {
          //inject script which will apply it for newly opened tabs
          injectScript(
            chrome.extension.getURL("/js/"),
            "makeRuleNamesLonger.js"
          );
          injectStyles(
            ".Temporary_top_tabs .Temporary_top_tabsList LI span#TABANCHOR { padding-right: 4px !important; padding-left: 4px; !important}"
          );
        }

        //FEATURE: close tab on middle click
        if (settings.devstudio.closeTabMiddleClick) {
          //inject script which will apply it for newly opened tabs
          injectScript(
            chrome.extension.getURL("/js/"),
            "closeTabMiddleClick.js"
          );

          // apply for existing tabs
          document.querySelectorAll("div.tStrCntr ul table#RULE_KEY span[data-stl='1'], div.tStrCntr ul table#RULE_KEY svg").forEach(function (elem) {
          	elem.addEventListener("mousedown", function (e) {
          		console.log(e);
          		if (e && (e.which == 2 || e.button == 4))
          			this.parentNode.parentNode.querySelector('#close').click();
          	})
          })
        }

        if (settings.devstudio.checkoutIndicator) {
          showCheckoutIndicator();
        }

        addHeaderShortcuts();
        customizeText();
        injectSidebarToggle();
      }
    }
  }

  // //TODO: alter to opposite behavior on right click
  // document
  //   .querySelector("div.tracer a")
  //   .addEventListener("contextmenu", function (e) {
  //     e.srcElement.click();
  //   });

  siteConfig(siteConfigCallback);

} //END applyPDTCustomization()

function alterTracerOpenBehavior(tracerOpenBehavior) {
  if (tracerOpenBehavior === "tracerOpenDefault" || !tracerOpenBehavior) return;
  else if (
    tracerOpenBehavior === "tracerOpenTab" ||
    tracerOpenBehavior === "tracerOpenWindowedTab"
  ) {
    let tracerDivContent = document.querySelector("div.tracer span");
    if (tracerDivContent) {
      let tracerDivContentHTML = tracerDivContent.innerHTML;
      if (tracerOpenBehavior === "tracerOpenTab")
        tracerDivContentHTML = tracerDivContentHTML
          .replace("location=0", "location=1")
          .replace("menubar=0", "menubar=1")
          .replace("toolbar=0", "toolbar=1")
          .replace("status=0", "status=1");
      tracerDivContent.innerHTML = tracerDivContentHTML;
    }
  }
}

//TODO: single observer for middle click, check-out indicator and others?
function showCheckoutIndicator() {
  const containerTabListIndicator = document.querySelector("div.tStrCntr ul");
  if (containerTabListIndicator) {
    const containerTabListCallbackIndicator = function (
      mutationsList,
      observer
    ) {
      mutationsList.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (DEBUG) console.log(node.nodeName);
          document.querySelectorAll("iframe").forEach((iframe) => {
            if (
              iframe.contentWindow.document.querySelectorAll(
                "button[title^='Check in']"
              ).length > 0
            )
              var elem = document.querySelector(
                "div.tStrCntr ul li[aria-label='" + iframe.title + "'] td span"
              );
            if (elem && !elem.innerText.startsWith("*")) {
              elem.innerText = "*" + elem.innerText;
              if (DEBUG) console.log(iframe.title);
            }
          });
        });
      });
    };
    const containerTabListIndicatorObserver = new MutationObserver(
      containerTabListCallbackIndicator
    );
    containerTabListIndicatorObserver.observe(containerTabListIndicator, {
      childList: true,
      subtree: true,
    });
  }
}

function addHeaderShortcuts() {
	//FEATURE: shortcuts to Search all options
	$("div.create-case").append(
	  '<div id="PegaDevToolsSearchAllOptionsLink"><a href="#" onclick="pd(event);" class="Header_nav margin-1x" role="menuitem" data-ctl="" data-click="[[&quot;runScript&quot;,[&quot;pega.ui.commandpalette.toggle()&quot;]]]"><span class="menu-item-title-wrap" data-click="."><span class="menu-item-title" data-click="..">Search</span></span></a></div>'
	);
  
	//FEATURE: shortcuts to Operators in header
	$("div.create-case").append(
	  '<div id="PegaDevToolsOperatorLink"><a href="#" onclick="pd(event);" class="Header_nav margin-1x" data-ctl="Link" name="pyStudioHome_pyDisplayHarness_10" data-click="[[&quot;openLandingPage&quot;,[&quot;Organization and Security: Organization&quot;,&quot;Display&quot;,{&quot;harnessName&quot;:&quot;pzLPOrganizationAndSecurityOrganization&quot;,&quot;className&quot;:&quot;Pega-Landing-Org&quot;,&quot;model&quot;:&quot;&quot;,&quot;page&quot;:&quot;&quot;,&quot;readOnly&quot;:&quot;false&quot;,&quot;contentID&quot;:&quot;b7d85aff-de9d-4a4d-9e1e-3b742e74078c&quot;,&quot;dynamicContainerID&quot;:&quot;&quot;,&quot;customParam&quot;:{}},{&quot;levelA&quot;:&quot;&quot;,&quot;levelB&quot;:&quot;&quot;,&quot;levelC&quot;:&quot;Operators&quot;}]]]" class=""><span class="menu-item-title-wrap" data-click=".">Op<span></a></div>'
	);
  
	//FEATURE: shortcuts to Logs in header
	$("div.create-case").append(
	  '<div id="PegaDevToolsLogLink"><a href="#" onclick="pd(event);" class="Header_nav margin-1x" role="menuitem" data-ctl="" data-click="[[&quot;openLandingPage&quot;,[&quot;System: Operations&quot;,&quot;Display&quot;,{&quot;harnessName&quot;:&quot;pzLPSystemOperationsClusterManagement&quot;,&quot;className&quot;:&quot;Pega-Landing-System-Operations&quot;,&quot;model&quot;:&quot;pzInitializeSystemOperationsLandingPage&quot;,&quot;page&quot;:&quot;&quot;,&quot;readOnly&quot;:&quot;false&quot;,&quot;contentID&quot;:&quot;a61bd6ee-9e44-4219-814e-2ba0edb7f7c1&quot;,&quot;dynamicContainerID&quot;:&quot;&quot;},{&quot;levelA&quot;:&quot;&quot;,&quot;levelB&quot;:&quot;&quot;,&quot;levelC&quot;:&quot;Logs&quot;}]]]"><span class="menu-item-title-wrap" data-click=".">Logs<span></a></div>'
	);
}

function customizeText() {
	/**** HEADER/TOP ****/

  //FEATURE: shorten Home tab name
  document.querySelector("span#TABANCHOR span.textIn").innerText = "H";

  //document.querySelector("span#TABANCHOR span.textIn").eq(0).replaceWith('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 14 14" style="display: inline; vertical-align: middle; margin-right: 3px;" xml:space="preserve"><style type="text/css">.st0{fill-rule:evenodd;clip-rule:evenodd;}</style><path class="st0" d="M13.9,7.8c-0.2,0.2-0.5,0.2-0.6,0l-1.9-2l0,7.8c0,0.2-0.2,0.4-0.4,0.4L3,14c-0.2,0-0.4-0.2-0.4-0.4l0-7.8  l-1.9,2c-0.2,0.2-0.5,0.2-0.6,0C0,7.5,0,7.3,0.1,7.1l6.6-7C6.8,0,6.9,0,7,0c0.1,0,0.2,0,0.3,0.1l6.5,7C14,7.3,14,7.6,13.9,7.8z   M7,1.1L3.4,4.9C3.5,5,3.5,5.1,3.5,5.2l0,7.9l7,0l0-7.9c0-0.1,0-0.2,0.1-0.3L7,1.1z"></path></svg>')

  //FEATURE: shorten Application label and make it bold
  if (document.querySelector("div.current-application label").innerText) {
    document.querySelector("div.current-application label").innerText = "App:";
    document.querySelector("div.current-application div a").style.fontWeight =
      "bolder";
  }

  /**** FOOTER ****/

  //FEATURE: shorten Accessibility
  document.querySelector("div.accessibility-toggle a").innerHTML = document
    .querySelector("div.accessibility-toggle a")
    .innerHTML.replace("Accessibility", "");
  //FEATURE: shorten Performance
  document.querySelector("div.pal-link a").innerHTML = document
    .querySelector("div.pal-link a")
    .innerHTML.replace("</i>Performance", "</i>");
  //FEATURE: shorten Issues
  document.querySelector("div.alerts a").innerHTML = document
    .querySelector("div.alerts a")
    .innerHTML.replace("Issues", "");

  //FEATURE: shorten Live Data
  var DataInspectorButton = document.querySelector(
    "div a[data-test-id='DataInspectorButton']"
  );
  if (DataInspectorButton) {
    DataInspectorButton.innerHTML = DataInspectorButton.innerHTML.replace(
      "Live Data",
      ""
    );
    //TODO:
    //replaceInnerHTML(DataInspectorButton, DataInspectorButton.innerHTML.replace("Live Data", ""));
  }
}

// BEGIN are we in dev studio?
console.log("Checking if in DEV studio");
if (isInDevStudio()) {
  console.log("In DEV studio - applying customizations");
  applyPDTCustomization();
}

