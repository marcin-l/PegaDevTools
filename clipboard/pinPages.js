console.log("PDT: pinPages.js");

// FEATURE: pin User Pages pages to top
let userPagesParent;
let userPages;
let pinnedPagesList = [];

// wait for document onload has already fired by using the document.readyState property
function waitForDocumentReady(callback) {
    if (document.readyState === 'complete') {
        // document is already ready, call the callback immediately
        callback();
    } else {
        // wait for the document to be fully loaded
        window.addEventListener('load', callback);
    }
}

// watch in DOM if item lost it's pinned style on blur
//TODO: use mutation observers or proxy https://stackoverflow.com/questions/4956935/how-to-observe-value-changes-in-js-variables
function checkPinnedPagesStyle() {
    setInterval(() => {
        pinnedPagesList.forEach(page => {
            const pageItem = document.querySelector(`div#gridBody_left > ul#gridNode0 > li > ul > li.gridRow[pl_index] > ul.rowContent li.dataValueRead div.oflowDiv span[title="${page}"]`);
			if(pageItem) {
	            const listItem = pageItem.closest("li").closest("ul").closest("li");	
	            if (listItem && !listItem.classList.contains("PDTpinned")) {
	                console.log("PDT: checkPinnedPagesStyle reapplying", page);
	                addUnpinIcon(listItem);
                    addPinIcon(listItem);
	            }
			}
        });
    }, 1000);
}

waitForDocumentReady(() => {
    document.arrive("div#gridBody_left ul#gridNode0 li ul li.gridRow[pl_index='1']", {onceOnly: true, existing: true}, () => {
        console.log("PDT: document ready");
        userPagesParent = document.querySelector("div#gridBody_left > ul#gridNode0 > li > ul#gridNode");
        userPages = document.querySelectorAll("div#gridBody_left > ul#gridNode0 > li > ul > li.gridRow > ul.rowContent li.dataValueRead div.oflowDiv");
        restorePinnedPages(userPages);
        userPages.forEach(addPinIcon);
        checkPinnedPagesStyle();
    });
});

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
				addUnpinIcon(listItem);
				sortListItems(parent);
				savePinnedPages();
            }
			event.stopPropagation();
        });

        target.appendChild(pinIcon);
    }
}

function addUnpinIcon(listItem) {
    if (listItem) {
		listItem.classList.add("PDTpinned");
        const unpinIcon = document.createElement('span');
        unpinIcon.innerHTML = '❌';
        unpinIcon.style.cursor = 'pointer';
        unpinIcon.style.marginLeft = '10px';
        unpinIcon.classList.add('PDTunpinIcon');
		unpinIcon.title = "Unpin";

        unpinIcon.addEventListener('click', (event) => {
			//move element to top of the list
            let listItem = event.target.closest("li").closest("ul").closest("li");	
            if (listItem && userPagesParent) {	
                listItem.classList.remove("PDTpinned");
                listItem.querySelector('.PDTunpinIcon').remove();
                sortListItems(userPagesParent);
                //remove current page from pinnedPagesList
                let title = listItem.querySelector("span:first-child")?.title;
                pinnedPagesList = pinnedPagesList.filter(item => item !== title);
                savePinnedPages();
            }
            event.stopPropagation();
        });
        
        listItem.querySelector(" ul.rowContent li.dataValueRead div.oflowDiv").appendChild(unpinIcon);
    }
}

function sortListItems(list) {
	console.log('PDT: sortListItems');
    const listItems = Array.from(list.children);

    // separate pinned and unpinned pages
    const pinnedItems = listItems.filter(item => item.classList.contains('PDTpinned'));
    const unpinnedItems = listItems.filter(item => !item.classList.contains('PDTpinned'));
	if(pinnedItems.length > 0) {
		// sort unpinned items based on the pl_index attribute
		unpinnedItems.sort((a, b) => {
			const aIndex = parseInt(a.getAttribute('pl_index'), 10);
			const bIndex = parseInt(b.getAttribute('pl_index'), 10);
			return aIndex - bIndex;
		});

		// clear the ul and append sorted items
		list.innerHTML = '';
		pinnedItems.forEach(item => list.appendChild(item));
		unpinnedItems.forEach(item => list.appendChild(item));
	}
}

injectStyles(`ul.cellHover span.PDTpinIcon { display: inline !important; }
    li.PDTpinned > ul div.oflowDiv { font-weight: bold; }
    li.PDTpinned span.PDTpinIcon { display: none !important;}`);

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
        console.log("PDT: restorePinnedPage", title);
		const listItem = item.closest("li").closest("ul").closest("li");	
		addUnpinIcon(listItem);
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