(function ($) {

})(jQuery);

//FEATURE: add link to pyWorkPage or RH_1 to header
function addpyWorkPageLink() {
	$("#devToolsGoToWorkPage").remove();

	var pyWorkPage = $("#gridNode li.gridRow ul li").has("span[title^='pyWorkPage']")[0];
	if (pyWorkPage) {
		$("header").append("<b><a id='devToolsGoToWorkPage' class='Explorer_action'>pyWorkPage</a></b>");
		$("#devToolsGoToWorkPage").click(function () { $("#gridNode li.gridRow ul li").has("span[title^='pyWorkPage']").first().trigger("click"); });
		let clsname = extractClassName($("#gridNode li.gridRow ul li span[title^='pyWorkPage']")[0].title);
		if (clsname)
			$("header").append(' <i class="dark_background_label_dataLabelForRead">(' + clsname + ')</i>');
		console.log('PDT pyWorkPage found');
	} else {
		pyWorkPage = $("#gridNode li.gridRow ul li").has("span[title^='RH_1']")[0];
		if (pyWorkPage) {
			$("header").append("<a id='devToolsGoToWorkPage' class='Explorer_action'>RH_1</a>");
			$("#devToolsGoToWorkPage").click(function () { $("#gridNode li.gridRow ul li").has("span[title^='RH_1']").first().trigger("click"); });
			console.log('PDT RH_1 found');
		}
		else {
			console.log('PDT no page found');
		}
	}
}

//FEATURE: add link to newAssignPage to header
function addnewAssignPage() {
	$("#devToolsGoToAssignPage").remove();

	var newAssignPage = $("#gridNode li.gridRow ul li").has("span[title^='newAssignPage']")[0];
	if (newAssignPage) {
		$("header").append(" <a id='devToolsGoToAssignPage' class='Explorer_action'>newAssignPage</a>");
		$("#devToolsGoToAssignPage").click(function () { $("#gridNode li.gridRow ul li").has("span[title^='newAssignPage']").first().trigger("click"); });
		let clsname = extractClassName($("#gridNode li.gridRow ul li span[title^='newAssignPage']")[0].title);
		if (clsname)
			$("header").append(' <i class="dark_background_label_dataLabelForRead">(' + clsname + ')</i>');
	}
}

//get config
function siteConfigCallback(siteConfig, globalConfig) {
	if (!globalConfig.settings || (globalConfig.settings && globalConfig.settings.clipboard.disabled)) {
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
				headerButtonsElement.insertAdjacentHTML("beforeend", "<div class='float-right' style='color: white; text-shadow: black 0px 0px 6px;background-color:#" + siteConfig.color + ";border:2px solid;border-top-style:none; border-right-style:none;margin: 0 0 4px 0;font-weight: bold;border-color:#" + siteConfig.color + "; padding:6px'>" + siteConfig.label + "</ div>");
			}

			if (siteConfig.useColorTop) {
				document.querySelector('div[data-portalharnessinsname="Pega-Clipboard!pzClipboard"]').style.cssText = "border-top: 2px; border-top-style: solid; border-color: #" + siteConfig.color;
			}
		}

		addpyWorkPageLink();
		addnewAssignPage();
		injectScript(chrome.extension.getURL("/resources/"), "jquery-3.4.1.min.js");
		injectScript(chrome.extension.getURL("/resources/"), "jquery.filtertable.min.js");
		injectScript(chrome.extension.getURL("/clipboard/"), "inject_clipboard.js");

		//remove unnecessary space in right panel
		$("div[node_name='pzClipboardToolbarWrapper'] > div").css("margin", 0)

		$("div[node_name='pzClipboardRight'] div.layout_body");
		$("div[node_name='pzClipboardRight'] div[section_index='4'].layout-body").css("padding-top", 0);

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