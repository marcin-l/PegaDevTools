function addOptionsSet() {
    document.getElementById('PDTConfigurationProfileNew').style.display = "block";
}


function togglePDTConfigurationProfiles() {
	var content = document.querySelector("#PDTConfigurationProfilesContent");
	if (content.style.display === "block") {
		content.style.display = "none";
		document.querySelector("#PDTConfigurationProfilesTab").style.display = "block";
	} else {
		content.style.display = "block";
		document.querySelector("#PDTConfigurationProfilesTab").style.display = "none";
	}
}

function stoppedTyping(){
	if(this.value.length > 0) { 
		document.getElementById('PDTConfigurationProfileSaveBtn').style = "display: initial"; 
	} else { 
		document.getElementById('PDTConfigurationProfileSaveBtn').style = "display: none"; 
	}
}

document.getElementById("addConfigProfile").addEventListener("click", addOptionsSet);
document.getElementById("PDTConfigurationProfilesTab").addEventListener("click", togglePDTConfigurationProfiles);
document.getElementById("PDTConfigurationProfilesContentTitle").addEventListener("click", togglePDTConfigurationProfiles);
document.getElementById("PDTConfigurationProfileNewName").addEventListener("keyup", stoppedTyping);