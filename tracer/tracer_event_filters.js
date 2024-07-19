PDT.isTracerEnabled().then(isTracerEnabled => {

	if (!isTracerEnabled) {
		console.log("PDT tracer disabled");
	} else {		
		applyFilters();
	}
});

function applyFilters() {
    console.log("PDT tracer_event_filters.js");
    let appliedFilters = [];

    const filterButton = document.createElement('div');
    filterButton.title = "Filter values";
    filterButton.className = "filterColumn";
    //filterButton.innerHTML = "🔍";
    filterButton.innerHTML = "&nbsp;";
    filterButton.style.color = "blue";
    filterButton.style.fontFamily = "PDTPegaIcons";
    filterButton.style.float = 'left';
    filterButton.style.cursor = "pointer";
    
    // filter div
    const filterDiv = document.createElement('div');
    filterDiv.className = "filterDiv";
    filterDiv.style.position = "fixed";
    filterDiv.style.top = '40px'; // TODO; adjust this value to position it below the first row
    filterDiv.style.right = '10px'; // TODO: adjust this value to position it on the right
    filterDiv.style.zIndex = '999';
    filterDiv.style.backgroundColor = 'white';
    filterDiv.style.padding = '10px';
    filterDiv.style.display = "none";

    const applyButton = document.createElement('button');
    applyButton.textContent = "Apply";

    function resetFilters() {
        
        document.querySelectorAll("div#traceEvent-CONTAINER table tr.PDTHideRow#eventRow").forEach(tr => {
            tr.classList.remove("PDThideRow");
        });
        appliedFilters = [];
    }

    function parentClickHandler(e) {
        e.target.closest("div.filterCheckboxDiv").querySelectorAll('.filterCheckboxChild').forEach(cb => cb.checked = e.target.checked);
    }

    function childClickHandler(e) {
        const parent = e.target.closest("div.filterCheckboxDiv");
        const parentCheckbox = parent.querySelector('input.filterCheckboxParent');

        const childCheckboxes = Array.from(parent.querySelectorAll('.filterCheckboxChild'));
        if(childCheckboxes.every(cb => cb.checked)) {           // if all children are checked then check parent
            parentCheckbox.indeterminate = false;
            parentCheckbox.checked = true;
        } else if(childCheckboxes.every(cb => !cb.checked)) {   // if all children are unchecked then uncheck parent
            parentCheckbox.indeterminate = false;
            parentCheckbox.checked = false;
        } else {                                                // if not all children are checked then parent is indeterminate
            parentCheckbox.indeterminate = true;
        }
    }

    const resetButton = document.createElement('button');
    resetButton.textContent = "Reset";
    resetButton.addEventListener('click', function (e) {
        resetFilters();
        filterDiv.style.display = "none";
        filterButton.innerHTML = "&nbsp;";
        filterButton.style.color = "blue";        
        e.preventDefault();
    });

    // filtering
    applyButton.addEventListener('click', function (e) {
        try {
            appliedFilters = Array.from(filterDiv.querySelectorAll('.filterCheckboxChild:not(:checked)')).map(cb => cb.value);
            if(appliedFilters.length == 0) {
                resetFilters();
            } else {
                filterButton.innerHTML = "&nbsp;";
                filterButton.style.color = "red";
            
                document.querySelectorAll("div#traceEvent-CONTAINER table tr#eventRow td.eventData:last-child").forEach(td => {
                    let parent = td.parentElement;
                    if(appliedFilters.indexOf(td.innerText) > -1) {
                        //parent.style.visibility = "collapse";
                        parent.classList.add("PDThideRow");
                    } else {
                        //parent.style.visibility = "";
                        parent.classList.remove("PDThideRow");
                    }
                });
            }
            
            filterDiv.style.display = "none";
            e.preventDefault();
        } catch (e) {
            console.error(e);
        }
    });

    document.querySelector("table#traceEvent-TABLE").insertAdjacentElement('afterend', filterDiv);

    filterButton.addEventListener('click', function () {
        // get unique values from the RuleSet column
        const ruleSetColumnValuesElem = document.querySelectorAll("div#traceEvent-CONTAINER table tr#eventRow td.eventData:last-child");
        const ruleSetColumnValues = [...new Set(Array.from(ruleSetColumnValuesElem).map(e => e.title))].sort();
        const nameVersionMap = new Map();

        ruleSetColumnValues.forEach(value => {
            if(value) {
                const [name, version] = value.split(' ');
            
                if (!nameVersionMap.has(name))
                    nameVersionMap.set(name, []);
            
                nameVersionMap.get(name).push(version);
            } else {
                if (!nameVersionMap.has("(blank)")) {
                    nameVersionMap.set("(blank)", []);
                }
            }
        });

        filterDiv.innerHTML = '';

        for (const [name, versions] of nameVersionMap) {
            const nameCheckboxDiv = document.createElement('div');
            nameCheckboxDiv.className = "filterCheckboxDiv";
            const nameCheckbox = document.createElement('input');
            nameCheckbox.type = "checkbox";
            nameCheckbox.classList.add("filterCheckbox");
            nameCheckbox.classList.add("filterCheckboxParent");
            nameCheckbox.value = name;
            nameCheckbox.checked = true;

            const nameLabel = document.createElement('label');
            if(name != "(blank)" && versions.length == 1) {
                nameLabel.textContent = `${name} ${versions[0]}`;
            }
            else {
                nameLabel.textContent = name;                
            }
            nameCheckbox.addEventListener('click', parentClickHandler);

            nameCheckboxDiv.appendChild(nameCheckbox);
            nameCheckboxDiv.appendChild(nameLabel);
            filterDiv.appendChild(nameCheckboxDiv);

            const versionContainer = document.createElement('div');
            if (versions.length > 1) {                
                versionContainer.style.marginLeft = '20px';
                versions.forEach(version => {
                    const versionCheckbox = document.createElement('input');
                    versionCheckbox.type = "checkbox";
                    versionCheckbox.classList.add("filterCheckbox");
                    versionCheckbox.classList.add("filterCheckboxChild");
                    versionCheckbox.value = `${name} ${version}`;
                    versionCheckbox.checked = true;
                    versionCheckbox.addEventListener('click', childClickHandler);

                    const versionLabel = document.createElement('label');
                    versionLabel.textContent = version;

                    versionContainer.appendChild(versionCheckbox);
                    versionContainer.appendChild(versionLabel);
                    versionContainer.appendChild(document.createElement('br'));
                    nameCheckboxDiv.appendChild(versionContainer);
                });
            } else {
                // for element with no children make versionContainer hidden. used to make filtering easier
                versionContainer.style.display = "none";
                const versionCheckbox = document.createElement('input');
                versionCheckbox.type = "checkbox";
                versionCheckbox.classList.add("filterCheckbox");
                versionCheckbox.classList.add("filterCheckboxChild");
                versionCheckbox.value = `${name} ${versions[0]}`;
                versionCheckbox.checked = true;
                versionContainer.appendChild(versionCheckbox);
                nameCheckboxDiv.appendChild(versionContainer);
            }
        };

        const buttonDiv = filterDiv.appendChild(document.createElement('div'));
        buttonDiv.style.marginTop = '10px';
        buttonDiv.style.minWidth = '100px';
        buttonDiv.style.display = 'flex';
        buttonDiv.style.justifyContent = 'space-evenly';
        buttonDiv.appendChild(applyButton);
        buttonDiv.appendChild(resetButton);
        filterDiv.appendChild(buttonDiv);
        filterDiv.style.display = "block";
    });
    document.querySelector('td.eventTitleBarStyle[title="RuleSet"]').appendChild(filterButton);
}