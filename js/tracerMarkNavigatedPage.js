function markNavigatedPage(e) {
	function animateCell(cell) {
		cell.style.border = "solid black";
		cell.style.borderWidth = "6px 0 6px";
		let animate = function() {
			let borderWidth = parseInt(cell.style.borderWidth);
			if (borderWidth > 0) {
				borderWidth--;
				cell.style.borderWidth = borderWidth + "px 0 " + borderWidth + "px";
				setTimeout(animate, 64);
		  	}
		};
		animate();
	}

	document
		.querySelectorAll("tr.eventTable")
		.forEach((el) => (el.style.backgroundColor = "#EFEFEF")); //revert highlight
	let eid = e.getAttribute("href");
	eid = eid.replaceAll("(", "\\(").replaceAll(")", "\\)"); //escape chars which querySelector doesn't like
	let elem = document.querySelector(eid);
	animateCell(elem);
	animateCell(elem.nextSibling);
	elem.parentNode.style.backgroundColor = "LightYellow";
}