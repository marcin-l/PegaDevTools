console.log("PDT: devstudio/refactorClass.js");

document.querySelectorAll("div.repeatContainer").forEach((e) => {
		e.insertAdjacentHTML('beforebegin', '<button onclick="document.querySelectorAll(\'div.repeatContainer input[type=checkbox]\').forEach((e)=> e.checked = false);return false;">Deselect all</button>');
	}
)