

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

//$("td.mainGridTableCell div#gridBody_right table.gridTable").filterTable()

