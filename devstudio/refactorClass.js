console.log("PDT: devstudio/refactorClass.js");

let rsContainer = document.querySelector("table[summary='pyRuleSetsToSearch']");
if (rsContainer) {
	let button = document.createElement("button");
	button.innerHTML = "Deselect all";
	button.onclick = (e) => {
		e.preventDefault();
        rsContainer.querySelectorAll("input[type=checkbox]").forEach((checkbox) => {
			checkbox.checked = false;
		});
	};
	rsContainer.querySelector("th#a2").insertAdjacentElement("beforeend", button);
}