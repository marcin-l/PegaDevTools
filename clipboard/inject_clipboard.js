//TODO: rework jQuery to vanilla js
//TODO: encapsulate extracting value by name - to be used in dynamic config of observed properties

function handleRightPanelChange() {
    return new Promise(() => {
		//handle pyWorkPage and RH_1
		if($(".heading_2").length>0 && $(".heading_2")[0].textContent == 'pyWorkPage') {
			var elem = $('div#gridBody_right table.gridTable td.dataLabelRead.gridCell').filter(function(){return this.textContent.trim() === "pyStatusWork"});
			if(elem.length > 0) {
				var status = elem.next()[0].innerText;
				if(status)
					$(".heading_2").append(" (<i>" + status + "</i>)");
			}
		}
		//handle newAssignPage
		else if($(".heading_2").length > 0 && $(".heading_2")[0].textContent == 'newAssignPage') {
			var addedText = "";
			var addedTextTooltip = "";
			var napelem = $('div#gridBody_right table.gridTable td.dataLabelRead.gridCell').filter(function(){return this.textContent.trim() === "pxObjClass"});
			if(napelem.length > 0) {
				var cls = napelem.next()[0].innerText;
				if(cls) {
					addedTextTooltip = cls;
					if(cls.includes("-"))
						cls = cls.split('-')[1];
					addedText += cls;					
				}
			}
			napelem = $('div#gridBody_right table.gridTable td.dataLabelRead.gridCell').filter(function(){return this.textContent.trim() === "pxAssignedOperatorID"});
				if(napelem.length > 0) {
				var op = napelem.next()[0].innerText;
				if(op)
					addedText += ": " + op;
			}
			if(cls)
				$(".heading_2").append(" (<i>" + addedText + "</i>)");
		}
		else { //handle all the rest
			var clselem = $('div#gridBody_right table.gridTable td.dataLabelRead.gridCell').filter(function(){return this.textContent.trim() === "pxObjClass"});
			if(clselem.length > 0) {
				var cls = clselem.next()[0].innerText;
				if(cls) {
					$(".heading_2").append(" (<i" + addedTextTooltip ? "title='"+ addedTextTooltip + "'" :  "" + ">" + cls + "</i>)");
				}
			}
		}
		if($('table.gridTable') && $('table.gridTable').eq(2)) {
			$('table.gridTable').eq(2).filterTable({label:"Search:", placeholder:"properties and values", minRows:7, quickListClear:"clear"});
			var addedFilterInput = document.querySelector("p.filter-table input");
			if(addedFilterInput)
				addedFilterInput.focus();
		}
    });
}

function stripeTable(table) {
	$(table).find('tr').removeClass('striped').filter(':visible:even').addClass('striped');
};

if(pega && pega.ui && pega.ui.Doc) {
	var origprocessActionGridDetail_Success = pega.ui.Doc.prototype.processActionGridDetail_Success;
	pega.ui.Doc.prototype.processActionGridDetail_Success = function() {        
    	origprocessActionGridDetail_Success.apply(this, arguments);
    	handleRightPanelChange();
}}