(function($) {

})(jQuery);

function addpyWorkPageLink() {
	$("#devToolsGoToWorkPage").remove();

	var pyWorkPage = $("#gridNode li.gridRow ul li").has("span[title^='pyWorkPage']")[0];
	if (pyWorkPage) {
		$("header").append("<a id='devToolsGoToWorkPage' class='Explorer_action'>pyWorkPage</a>");
		$("#devToolsGoToWorkPage").click(function() { $("#gridNode li.gridRow ul li").has("span[title^='pyWorkPage']").first().trigger("click"); });
	} else {
		pyWorkPage = $("#gridNode li.gridRow ul li").has("span[title^='RH_1']")[0];
		if (pyWorkPage) {
			$("header").append("<a id='devToolsGoToWorkPage' class='Explorer_action'>RH_1</a>");
			$("#devToolsGoToWorkPage").click(function() { $("#gridNode li.gridRow ul li").has("span[title^='RH_1']").first().trigger("click"); });
		}
	}
}

/*
function addRightPanelObserver() {
	var rightPanel = document.getElementById('bodyTbl_right');

	var rightPanelConfig = { attributes: true, childList: true, subtree: true };

	// Callback function to execute when mutations are observed
	var rightPanelCallback = function(mutationsList, observer) {
		for(var mutation of mutationsList) {
			if (mutation.type == 'childList') {
				$("#bodyTbl_right tbody tr").has("a[title='pyStatusWork']").css("background", "red");
				console.log('childlist');
			}
			//else if (mutation.type == 'attributes') {
			//    console.log('The ' + mutation.attributeName + ' attribute was modified.');
			//}
		}
	};

	var rightPanelObserver = new MutationObserver(rightPanelCallback);
	rightPanelObserver.observe(rightPanel, rightPanelConfig);
	console.log('addRightPanelObserver');
}

const documentObserver = new MutationObserver(function(mutationsList) {
		for(var mutation of mutationsList) {
			if (mutation.type == 'subtree') {
				addRightPanelObserver();
				console.log('documentObserver');
			}
		}	
	});
	
documentObserver.observe(document.getElementById('$PClipboardPages$ppzClipboardPage$l1'), { subtree: true, childList: true});*/
console.log('PDT clipboard');
addpyWorkPageLink();
//injectScript(chrome.extension.getURL("/resources/"), "jquery-3.4.1.min.js");
injectScript(chrome.extension.getURL("/resources/"), "jquery.filtertable.min.js");
injectScript(chrome.extension.getURL("/clipboard/"), "inject_clipboard.js");


//remove unnnecessary space in right panel
$("div[node_name='pzClipboardToolbarWrapper'] > div").css("margin", 0)


$("div[node_name='pzClipboardRight'] div.layout_body");
$("div[node_name='pzClipboardRight'] div[section_index='4'].layout-body").css("padding-top", 0);

//$("td.mainGridTableCell div#gridBody_right table.gridTable").filterTable()

setTimeout(() => {
	var addedGoToWorkPage = document.querySelector("#devToolsGoToWorkPage");
	if (addedGoToWorkPage)
		addedGoToWorkPage.focus();
}, 500);