//FEATURE: add link to pyWorkPage or RH_1 to header
function addpyWorkPageLink() {
	jQuery("#devToolsGoToWorkPage").remove();

	//search for pyWorkPage
	var pyWorkPage = jQuery("#gridNode li.gridRow ul li").has("span[title^='pyWorkPage']")[0];
	if (pyWorkPage && pyWorkPage.getInnerHTML().indexOf("classless") < 0 && pyWorkPage.getInnerHTML().indexOf("ProjectManagement") < 0) {
		jQuery("header").append("<b><a id='devToolsGoToWorkPage' class='Explorer_action'>pyWorkPage</a></b>");
		jQuery("#devToolsGoToWorkPage").click(function () { jQuery("#gridNode li.gridRow ul li").has("span[title^='pyWorkPage']").first().trigger("click"); });
		let title = jQuery("#gridNode li.gridRow ul li span[title^='pyWorkPage']")[0].title;
		let clsname = extractClassName(title);
		let clsnamefull = extractClassName(title, true);
		if (clsname)
			jQuery("header").append(' <i class="dark_background_label_dataLabelForRead" title="' + clsnamefull + '">(' + clsname + ')</i>');
		console.log('PDT pyWorkPage found');
	}

	//search for RH_1
	pyWorkPage = jQuery("#gridNode li.gridRow ul li").has("span[title^='RH_1']")[0];
	if (pyWorkPage) {
		jQuery("header").append("<a id='devToolsGoToWorkPage' class='Explorer_action'>RH_1</a>");
		jQuery("#devToolsGoToWorkPage").click(function () { jQuery("#gridNode li.gridRow ul li").has("span[title^='RH_1']").first().trigger("click"); });
		let title = jQuery("#gridNode li.gridRow ul li span[title^='RH_1']")[0].title;
		let clsname = extractClassName(title);
		let clsnamefull = extractClassName(title, true);
		if (clsname)
			jQuery("header").append(' <i class="dark_background_label_dataLabelForRead" title="' + clsnamefull + '">(' + clsname + ')</i>');
		console.log('PDT RH_1 found');
	}
		// else {
		// 	console.log('PDT no page found');
		// }
}

//FEATURE: add link to newAssignPage to header
function addnewAssignPage() {
	jQuery("#devToolsGoToAssignPage").remove();

	var newAssignPage = jQuery("#gridNode li.gridRow ul li").has("span[title^='newAssignPage']")[0];
	if (newAssignPage) {
		jQuery("header").append(" <a id='devToolsGoToAssignPage' class='Explorer_action'>newAssignPage</a>");
		jQuery("#devToolsGoToAssignPage").click(function () { jQuery("#gridNode li.gridRow ul li").has("span[title^='newAssignPage']").first().trigger("click"); });
		let clsname = extractClassName(jQuery("#gridNode li.gridRow ul li span[title^='newAssignPage']")[0].title);
		if (clsname) {
			jQuery("header").append(' <i class="dark_background_label_dataLabelForRead" title="' + clsname + '">(' + clsname + ')</i>');
		}
	}
}

//get config
function siteConfigCallback(siteConfig, globalConfig) {
	PDT.alterFavicon();
	
	if (! PDT.isClipboardEnabled()) {
		console.log('PDT clipboard disabled');
	} else {
		console.log('PDT clipboard');

		if (siteConfig && siteConfig.label) {
			if (globalConfig.settings && globalConfig.settings.useSiteLabelForBrowserTitle) {
				var newTitle = siteConfig.label + " Clipboard";
				parent.document.title = newTitle;
			}

			var headerButtonsElement = document.querySelector('div[node_name="pzClipboardHeader"] div.float-right div.layout-content-header_menu_secondary');
			if (headerButtonsElement) {
				headerButtonsElement.insertAdjacentHTML("beforeend", "<div class='float-right' style='color: white; text-shadow: black 0px 0px 6px;background-color:#" + siteConfig.color.replace("#", '') + ";border:2px solid;border-top-style:none; border-right-style:none;margin: 0 0 4px 0;font-weight: bold;border-color:#" + siteConfig.color.replace("#", '') + "; padding:6px'>" + siteConfig.label + "</ div>");
			}

			if (siteConfig.useColorTop) {
				document.querySelector('div[data-portalharnessinsname="Pega-Clipboard!pzClipboard"]').style.cssText = "border-top: 2px; border-top-style: solid; border-color: #" + siteConfig.color.replace("#", '');
			}
		}

		injectScript("/resources/", "jquery-3.4.1.min.js");
		injectScript("/resources/", "jquery.filtertable.min.js");

		addpyWorkPageLink();
		addnewAssignPage();
		injectScript("/clipboard/", "inject_clipboard.js");

		//remove unnecessary space in right panel
		jQuery("div[node_name='pzClipboardToolbarWrapper'] > div").css("margin", 0)

		//jQuery("div[node_name='pzClipboardRight'] div.layout_body");
		jQuery("div[node_name='pzClipboardRight'] div[section_index='4'].layout-body").css("padding-top", 0);

		setTimeout(() => {
			var addedGoToWorkPage = document.querySelector("#devToolsGoToWorkPage");
			if (addedGoToWorkPage)
				addedGoToWorkPage.focus();
		}, 2000);

		//FEATURE: split clipboard panels 50/50
		if (globalConfig.settings.clipboard.split5050) {
			injectStyles(`/** makes clipboard panels split 50/50 **/
			.flex.screen-layout-header_left > .screen-layout-region-main-sidebar1 {
			width:50%;
			}
			.flex.screen-layout-header_left .screen-layout-region-main-sidebar1> #sidebar-collapse-left{
			left:50%;
			}
			.flex.screen-layout-header_left > .screen-layout-region-main-middle {
			width:50%;
			padding-left: 0.5em;
			}`);
		}
	}
}

siteConfig(siteConfigCallback);