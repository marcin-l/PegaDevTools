$("div#traceEvent-CONTAINER").on("contextmenu", "td#eventLineNumber", function (evt) { evt.preventDefault(); $(this).toggleClass("PegaDevToolsTextRed"); });

function injectStyles(rule) {
  var div = $("<div />", {
    html: '&shy;<style>' + rule + '</style>'
  }).appendTo("body");
};

var removeThreadNameButton = $('<span title="Remove" style="margin-left:3px; cursor:pointer">x</span>');
removeThreadNameButton.click(function () { injectStyles('td.EventDataCenter#threadname { display: none}'); $('td.eventTitleBarStyle[title="Thread"]').css('display', 'none'); });
$('td.eventTitleBarStyle[title="Thread"]').append(removeThreadNameButton);

var removeIntBtn = $('<span title="Remove" style="margin-left:3px; cursor:pointer">x</span>');
removeIntBtn.click(function () { injectStyles('div#traceEvent-CONTAINER table td:nth-child(6) { display: none}'); $('td.eventTitleBarStyle[title="Int"]').css('display', 'none'); });
$('td.eventTitleBarStyle[title="Int"]').append(removeIntBtn);

var removeElapsedBtn = $('<span title="Remove" style="margin-left:3px; cursor:pointer">x</span>');
removeElapsedBtn.click(function () { injectStyles('div#traceEvent-CONTAINER table td:nth-child(13) { display: none}'); $('td.eventTitleBarStyle[title="Elapsed"]').css('display', 'none'); });
$('td.eventTitleBarStyle[title="Elapsed"]').append(removeElapsedBtn);

var removeRuleNoBtn = $('<span title="Remove" style="margin-left:3px; cursor:pointer">x</span>');
removeRuleNoBtn.click(function () { injectStyles('div#traceEvent-CONTAINER table td:nth-child(7) { display: none}'); $('td.eventTitleBarStyle[title="Rule#"]').css('display', 'none'); });
$('td.eventTitleBarStyle[title="Rule#"]').append(removeRuleNoBtn);

//TODO - requestor div element added when events are captured
// var removeRequestorBtn = '<span id="PDTRemoveRequestor" title="Remove" style="margin-left:3px; cursor:pointer">x</span>';
// document.querySelector('div#traceEvent-CONTAINER div div h2').insertAdjacentHTML("beforeend", removeRequestorBtn);
// document.querySelector('div#traceEvent-CONTAINER div div span#PDTRemoveRequestor').click(function () { injectStyles('div#traceEvent-CONTAINER div div { display: none}');  });


var dropdown = document.createElement("div");
dropdown.className = "dropdown-content";
document.querySelector("body#main").appendChild(dropdown);

