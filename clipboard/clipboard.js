//FEATURE: add link to pyWorkPage or RH_1 to header
function addpyWorkPageLink() {
	jQuery("#devToolsGoToWorkPage").remove();

	//search for pyWorkPage
	let pyWorkPage = jQuery("#gridNode li.gridRow ul li").has("span[title^='pyWorkPage']")[0];
	if (pyWorkPage && pyWorkPage.getInnerHTML().indexOf("classless") < 0 && pyWorkPage.getInnerHTML().indexOf("ProjectManagement") < 0) {
		jQuery("header").append("<b><a id='devToolsGoToWorkPage' class='Explorer_action'>pyWorkPage</a></b>");
		jQuery("a#devToolsGoToWorkPage").click(function () { jQuery("#gridNode li.gridRow ul li").has("span[title^='pyWorkPage']").first().trigger("click"); });
		let title = jQuery("#gridNode li.gridRow ul li span[title^='pyWorkPage']")[0].title;
		let clsName = extractClassName(title);
		let clsNameFull = extractClassName(title, true);
		if (clsName)
			jQuery("header").append(' <i class="dark_background_label_dataLabelForRead" title="' + clsNameFull + '">(' + clsName + ')</i> ');
		pyWorkPage.style.fontWeight = "bold";
		console.log('PDT pyWorkPage found');
	}

	//search for RH_1
	pyWorkPage = jQuery("#gridNode li.gridRow ul li").has("span[title^='RH_1']")[0];
	if (pyWorkPage) {
		jQuery("header").append("<a id='devToolsGoToWorkPage' class='Explorer_action'>RH_1</a>");
		jQuery("a#devToolsGoToWorkPage").click(function () { jQuery("#gridNode li.gridRow ul li").has("span[title^='RH_1']").first().trigger("click"); });
		let title = jQuery("#gridNode li.gridRow ul li span[title^='RH_1']")[0].title;
		let clsName = extractClassName(title);
		let clsNameFull = extractClassName(title, true);
		if (clsName)
			jQuery("header").append(' <i class="dark_background_label_dataLabelForRead" title="' + clsNameFull + '">(' + clsName + ')</i> ');
		pyWorkPage.style.fontWeight = "bold";
		console.log('PDT RH_1 found');
	}
		// else {
		// 	console.log('PDT no page found');
		// }
}

//FEATURE: add link to newAssignPage to header
function addNewAssignPage() {
	jQuery("#devToolsGoToAssignPage").remove();

	let newAssignPage = jQuery("#gridNode li.gridRow ul li").has("span[title^='newAssignPage']")[0];
	if (newAssignPage) {
		let clsName = extractClassName(jQuery("#gridNode li.gridRow ul li span[title^='newAssignPage']")[0].title);
		if (clsName && clsName !== "Assign-") {
			jQuery("header").append(" <a id='devToolsGoToAssignPage' class='Explorer_action'>newAssignPage</a>");
			jQuery("#devToolsGoToAssignPage").click(function () { jQuery("#gridNode li.gridRow ul li").has("span[title^='newAssignPage']").first().trigger("click"); });
			jQuery("header").append(' <i class="dark_background_label_dataLabelForRead" title="' + clsName + '">(' + clsName + ')</i>');
			newAssignPage.style.fontWeight = "bold";
		}
	}
}

//TODO: change to async
function siteConfigCallback(siteConfig, globalConfig) {
	PDT.alterFavicon();
	
	if (! PDT.isClipboardEnabled()) {
		console.log('PDT clipboard disabled');
	} else {
		console.log('PDT clipboard');

		if (siteConfig && siteConfig.label) {
			if (globalConfig.settings && globalConfig.settings.useSiteLabelForBrowserTitle) {
				let newTitle = siteConfig.label + " Clipboard";
				parent.document.title = newTitle;
			}

			let headerButtonsElement = document.querySelector('div[node_name="pzClipboardHeader"] div.float-right div.layout-content-header_menu_secondary');
			if (headerButtonsElement) {
				headerButtonsElement.insertAdjacentHTML("beforeend", "<div class='float-right' style='color: white; text-shadow: black 0px 0px 6px;background-color:#" + siteConfig.color.replace("#", '') + ";border:2px solid;border-top-style:none; border-right-style:none;margin: 0 0 4px 0;font-weight: bold;border-color:#" + siteConfig.color.replace("#", '') + "; padding:6px'>" + siteConfig.label + "</ div>");
			}

			if (siteConfig.useColorTop) {
				document.querySelector('div[data-portalharnessinsname="Pega-Clipboard!pzClipboard"]').style.cssText = "border-top: 2px; border-top-style: solid; border-color: #" + siteConfig.color.replace("#", '');
			}
		}

		injectScript("/resources/", "jquery-3.4.1.min.js");
		injectScript("/resources/", "jquery.filtertable.min.js");

		//FEATURE: Display in fullscreen
		if (globalConfig.settings.clipboard.fullscreen) {
			PDT.makeFullscreen();
		}

		addpyWorkPageLink();
		addNewAssignPage();
		injectScript("/clipboard/", "inject_clipboard.js");

		//FEATURE: remove unnecessary space in right panel
		jQuery("div[node_name='pzClipboardToolbarWrapper'] > div").css("margin", 0)

		//jQuery("div[node_name='pzClipboardRight'] div.layout_body");
		jQuery("div[node_name='pzClipboardRight'] div[section_index='4'].layout-body").css("padding-top", 0);

		//TODO: focus needed?
		document.arrive("a#devToolsGoToWorkPage", {onceOnly: true, existing: true}, () => 	{
			let addedGoToWorkPage = document.querySelector("#devToolsGoToWorkPage");
			if (addedGoToWorkPage)
				addedGoToWorkPage.focus();
		});

		//FEATURE: split clipboard panels 50/50
		if (globalConfig.settings.clipboard.split5050) {
			injectStyles(`/** makes clipboard panels split 50/50 **/
				.flex.screen-layout-header_left > .screen-layout-region-main-sidebar1 {
					width:50%;}
				.flex.screen-layout-header_left .screen-layout-region-main-sidebar1> #sidebar-collapse-left{
					left:50%;}
				.flex.screen-layout-header_left > .screen-layout-region-main-middle {
					width:50%;
					padding-left: 0.5em;}`);
		}
	}
}

siteConfig(siteConfigCallback);


// FEATURE: pin User Pages pages to top
const userPagesParent = document.querySelector("div#gridBody_left > ul#gridNode0 > li > ul#gridNode");
const userPages = document.querySelectorAll("div#gridBody_left > ul#gridNode0 > li > ul > li.gridRow > ul.rowContent li.dataValueRead div.oflowDiv");
let pinnedPagesList = [];
userPages.forEach(addPinIcon);

function addPinIcon(target) {
    if (target) {
        // Create the pin icon element
        const pinIcon = document.createElement('span');
        pinIcon.innerHTML = '📌';
        pinIcon.style.cursor = 'pointer';
        pinIcon.style.marginLeft = '10px';
		pinIcon.classList.add('PDTpinIcon');
		pinIcon.style.display = "none";
		pinIcon.title = "Pin to top";

        pinIcon.addEventListener('click', (event) => {
			const listItem = event.target.closest("li").closest("ul").closest("li");			
            const parent = listItem.parentNode;
            if (listItem && parent) {
                //parent.insertBefore(listItem, parent.firstChild);				
				addUnpinIcon(listItem);
				sortListItems(parent);
				savePinnedPages();
            }
			event.stopPropagation();
        });

        target.appendChild(pinIcon);
    }
}

// save pin setting to browser storage
function savePinSetting(listItem) {
	if(listItem.classList.contains("PDTpinned")) {	// add
		localStorage.setItem("PDTpinned", listItem.id);
	} else { //remove
		localStorage.removeItem("PDTpinned");
	}
}

function addUnpinIcon(listItem, skipSort = false) {
    if (listItem) {
		listItem.classList.add("PDTpinned");
		//savePinSetting(listItem);
        const unpinIcon = document.createElement('span');
        unpinIcon.innerHTML = '❌';
        unpinIcon.style.cursor = 'pointer';
        unpinIcon.style.marginLeft = '10px';
        unpinIcon.classList.add('PDTunpinIcon');
		unpinIcon.title = "Unpin";

        unpinIcon.addEventListener('click', (event) => {
			//move element to top of the list
            let listItem = event.target.closest("li").closest("ul").closest("li");	
            //const parent = listItem.parentNode;
            if (listItem && userPagesParent) {
                //userPagesParent.appendChild(listItem);		// ??		
                listItem.classList.remove("PDTpinned");
                listItem.querySelector('.PDTunpinIcon').remove();
				if(!skipSort)
					sortListItems(userPagesParent);
				//savePinSetting(listItem);
            }
            event.stopPropagation();
        });
        
        listItem.querySelector(" ul.rowContent li.dataValueRead div.oflowDiv").appendChild(unpinIcon);
    }
}

function sortListItems(list) {
	console.log('PDT: sortListItems');
    const listItems = Array.from(list.children);

    // Separate pinned and unpinned items
    const pinnedItems = listItems.filter(item => item.classList.contains('PDTpinned'));
    const unpinnedItems = listItems.filter(item => !item.classList.contains('PDTpinned'));
	if(pinnedItems.length > 0) {
		// Sort unpinned items based on the pl_index attribute
		unpinnedItems.sort((a, b) => {
			const aIndex = parseInt(a.getAttribute('pl_index'), 10);
			const bIndex = parseInt(b.getAttribute('pl_index'), 10);
			return aIndex - bIndex;
		});

		// Clear the ul and append sorted items
		list.innerHTML = '';
		pinnedItems.forEach(item => list.appendChild(item));
		unpinnedItems.forEach(item => list.appendChild(item));
	}
}


injectStyles(`ul.cellHover span.PDTpinIcon {
    display: inline !important;
}`);

injectStyles(`li.PDTpinned > ul div.oflowDiv {
    font-weight: bold;
}`);

injectStyles(`li.PDTpinned span.PDTpinIcon {
    display: none !important;
}`);

function restorePinnedPages(userPages) {
	console.log('PDT: restorePinnedPages');
    browser.storage.local.get('pinnedPagesList', (data) => {
        if (data.pinnedPagesList) {
            pinnedPagesList = data.pinnedPagesList;
			userPages.forEach(restorePinnedPage);
			sortListItems(userPagesParent);
            console.log('PDT: pinned pages restored:', pinnedPagesList);			
        } else {
            console.log('PDT pinned pages could not be restored');		
        }
    });
}

function restorePinnedPage(item) {
	let title = item.querySelector("span:first-child")?.title;
	if(title && pinnedPagesList.includes(title)) {
		const listItem = item.closest("li").closest("ul").closest("li");	
		addUnpinIcon(listItem, true);
	}
}

function savePinnedPages() {
    const pinnedElemList = document.querySelectorAll("div#gridBody_left > ul#gridNode0 > li > ul > li.gridRow.PDTpinned > ul.rowContent li.dataValueRead div.oflowDiv > span:first-child");
	let newPinnedPagesList = Array.from(pinnedElemList).map(item => item.title);
	newPinnedPagesList = [...new Set([...newPinnedPagesList, ...pinnedPagesList])]; // array union


    if(pinnedPagesList != newPinnedPagesList) {
        browser.storage.local.set({ pinnedPagesList: newPinnedPagesList }, () => {
            console.log('PDT: pinned pages list state saved:', newPinnedPagesList);
        });
        pinnedPagesList = newPinnedPagesList;
    }
}

restorePinnedPages(userPages);

userPagesParent.arrive("li.gridRow", {onceOnly: false, existing: false}, (elem) => {
	console.log("arrive ", elem);
    restorePinnedPage(elem);
});

//observe userPages li items replacement
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE && node.matches('li.gridRow')) {
                    console.log('Observed new li.gridRow:', node);
                    restorePinnedPage(node);
                }
            });
        }
    });
});

const userPagesParentNode = document.querySelector(userPagesParent);

if (userPagesParentNode instanceof Node) {
    observer.observe(userPagesParentNode, { childList: true, subtree: true });
} else {
    console.error("TypeError: Failed to execute 'observe' on 'MutationObserver': parameter 1 is not of type 'Node'.");
}


