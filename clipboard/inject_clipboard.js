function handleRightPanelChange() {
    return new Promise(() => {
        if($(".heading_2").length>0 && $(".heading_2")[0].textContent == 'pyWorkPage') {
			var elem = $('div#gridBody_right table.gridTable td.dataLabelRead.gridCell').filter(function(){return this.textContent.trim() === "pyStatusWork"});
			if(elem.length > 0) {
				var status = elem.next()[0].innerText;
				if(status)
					$(".heading_2").append(" (<i>" + status + "</i>)");
			}
		}
		$('table.gridTable').eq(2).filterTable();
		var addedFilterInput = document.querySelector("p.filter-table input");
		if(addedFilterInput)
			addedFilterInput.focus();
    });
}



var origprocessActionGridDetail_Success = pega.ui.Doc.prototype.processActionGridDetail_Success;
pega.ui.Doc.prototype.processActionGridDetail_Success = function() {        
    origprocessActionGridDetail_Success.apply(this, arguments);
    handleRightPanelChange();
}

