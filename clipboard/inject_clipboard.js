//TODO: rework jQuery to vanilla js
//TODO: encapsulate extracting value by name - to be used in dynamic config of observed properties

$.noConflict();

function handleRightPanelChange() {
    return new Promise(() => {
		//handle pyWorkPage
		if(jQuery(".heading_2").length>0 && jQuery(".heading_2")[0].textContent == 'pyWorkPage') {
			let elem = jQuery('div#gridBody_right table.gridTable td.dataLabelRead.gridCell').filter(function(){return this.textContent.trim() === "pyStatusWork"});
			if(elem.length > 0) {
				let status = elem.next()[0].innerText;
				if(status)
					jQuery(".heading_2").append(" (<i>" + status + "</i>)");
			}
		}
		//handle newAssignPage
		else if(jQuery(".heading_2").length > 0 && jQuery(".heading_2")[0].textContent == 'newAssignPage') {
			let addedText = "";
			let napElem = jQuery('div#gridBody_right table.gridTable td.dataLabelRead.gridCell').filter(function(){return this.textContent.trim() === "pxObjClass"});
			if(napElem.length > 0) {
				let cls = napElem.next()[0].innerText;
				if(cls) {
					if(cls.includes("-"))
						cls = cls.split('-')[1];
					addedText += cls;					
				}
			}
			napElem = jQuery('div#gridBody_right table.gridTable td.dataLabelRead.gridCell').filter(function(){return this.textContent.trim() === "pxAssignedOperatorID"});
				if(napElem.length > 0) {
					let op = napElem.next()[0].innerText;
				if(op)
					addedText += ": " + op;
			}
			if(cls)
				jQuery(".heading_2").append(" (<i>" + addedText + "</i>)");
		}
		else { //handle all the rest
			let classElement = jQuery('div#gridBody_right table.gridTable td.dataLabelRead.gridCell').filter(function(){return this.textContent.trim() === "pxObjClass"});
			if(classElement.length > 0) {
				let cls = classElement.next()[0].innerText;
				if(cls) {
					jQuery(".heading_2").append(" (<i>" + cls + "</i>)");
				}
			}
		}
		//TODO: change to own implementation, like tracer_page, and remove jQuery.filterTable
		if(jQuery('table.gridTable') && jQuery('table.gridTable').eq(2)) {
			document.querySelectorAll("table.gridTable table tr tr").forEach((e) => { e.classList.add("noFilter") });
			//immediately invoked function expression to avoid "$" conflicts using plugins
			(function( $ ) {
				$('table.gridTable').eq(2).filterTable({label:"Search:", placeholder:"properties and values", minRows:7, quickListClear:"clear"});
			})( jQuery );
			let addedFilterInput = document.querySelector("p.filter-table input");
			if(addedFilterInput)
				addedFilterInput.focus();
		}
    });
}

function stripeTable(table) {
	jQuery(table).find('tr').removeClass('striped').filter(':visible:even').addClass('striped');
};

if(pega && pega.ui && pega.ui.Doc) {
	let origprocessActionGridDetail_Success = pega.ui.Doc.prototype.processActionGridDetail_Success;
	pega.ui.Doc.prototype.processActionGridDetail_Success = function() {        
    	origprocessActionGridDetail_Success.apply(this, arguments);
    	handleRightPanelChange();
}}