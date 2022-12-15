//FEATURE mark row on right-click
$("div#traceEvent-CONTAINER").on("contextmenu", "td#eventLineNumber", function (evt) { evt.preventDefault(); $(this).parent().toggleClass("PegaDevToolsTextRed"); });

//FEATURE hide columns
const removeThreadNameButton = $('<span title="Remove column" class="removeColumn">x</span>');
removeThreadNameButton.click(function () { injectStyles('td.EventDataCenter#threadname { display: none}'); $('td.eventTitleBarStyle[title="Thread"]').css('display', 'none'); });
$('td.eventTitleBarStyle[title="Thread"]').append(removeThreadNameButton);

const removeIntBtn = $('<span title="Remove column" class="removeColumn">x</span>');
removeIntBtn.click(function () { injectStyles('div#traceEvent-CONTAINER table td:nth-child(6) { display: none}'); $('td.eventTitleBarStyle[title="Int"]').css('display', 'none'); });
$('td.eventTitleBarStyle[title="Int"]').append(removeIntBtn);

const removeElapsedBtn = $('<span title="Remove column" class="removeColumn">x</span>');
removeElapsedBtn.click(function () { injectStyles('div#traceEvent-CONTAINER table td:nth-child(13) { display: none}'); $('td.eventTitleBarStyle[title="Elapsed"]').css('display', 'none'); });
$('td.eventTitleBarStyle[title="Elapsed"]').append(removeElapsedBtn);

const removeRuleNoBtn = $('<span title="Remove column" class="removeColumn">x</span>');
removeRuleNoBtn.click(function () { injectStyles('div#traceEvent-CONTAINER table td:nth-child(7) { display: none}'); $('td.eventTitleBarStyle[title="Rule#"]').css('display', 'none'); });
$('td.eventTitleBarStyle[title="Rule#"]').append(removeRuleNoBtn);

const removeAllColumnsBtn = $('<div title="Remove all columns" class="removeColumn">X</div>');
removeAllColumnsBtn.click(function () { $('span.removeColumn').click(); $(this).css('display', 'none'); });
$('td.eventTitleBarStyle[title="Line"]').prev().append(removeAllColumnsBtn);