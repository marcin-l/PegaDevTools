//FEATURE mark row on right-click
$("div#traceEvent-CONTAINER").on("contextmenu", "td#eventLineNumber", function (evt) { evt.preventDefault(); $(this).parent().toggleClass("PegaDevToolsTextRed"); });

//FEATURE hide columns
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
