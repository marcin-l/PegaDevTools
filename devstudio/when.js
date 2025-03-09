
function getNavigation() {
    return document.querySelector("div.menu-panel-wrapper ul.menu[id^='pyNavigation']");
}

function addSearch() {
    function createSearchBox(navi) {
        let searchBox = document.createElement('input');
        searchBox.type = 'text';
        searchBox.placeholder = '';
        searchBox.onclick = function(event) { event.preventDefault(); event.stopPropagation(); return false; }
        searchBox.onkeyup = function() {
          let searchText = searchBox.value.toLowerCase();
          let listItems = navi.getElementsByTagName('li');
          for (let i = 1; i < listItems.length; i++) {
            let item = listItems[i];
            let spans = item.getElementsByTagName('span');
            let found = false;
            for (let j = 0; j < spans.length; j++) {
                let span = spans[j];
                if (span.innerHTML.toLowerCase().indexOf(searchText) > -1) {
                    found = true;
                    break;
                }
            }
            if (found) {
              item.style.display = '';
            } else {
              item.style.display = 'none';
            }
          }
        };

        return searchBox;
      }
    
    let searchBox = createSearchBox(getNavigation());
    let searchBoxWithLabel = document.createElement('p');
    searchBoxWithLabel.id = "PDTSearchBox";
    searchBoxWithLabel.innerHTML = 'Search: ';
    searchBoxWithLabel.appendChild(searchBox);
    getNavigation().insertAdjacentElement("afterbegin", searchBoxWithLabel);
//     document.arrive("p#PDTSearchBox", {onceOnly: true, existing: true}, () => 	{
//         searchBox.focus();
//     });
}