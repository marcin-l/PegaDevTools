function markNavigatedPage(e) {
	document
		.querySelectorAll("tr.eventTable")
		.forEach((el) => (el.style.backgroundColor = "#EFEFEF")); //revert highlight
	let eid = e.getAttribute("href");
	eid = eid.replaceAll("(", "\\(").replaceAll(")", "\\)"); //escape chars which querySelector doesn't like
	document.querySelector(eid).parentNode.style.backgroundColor = "LightYellow";
}
