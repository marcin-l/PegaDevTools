//TODO: remove jQuery

//FEATURE: Mark row on right-click
$("div#traceEvent-CONTAINER").on("contextmenu", "td#eventLineNumber", function (evt) { evt.preventDefault(); $(this).parent().toggleClass("PegaDevToolsTextRed"); });

//FEATURE: Remove columns
const removeThreadNameButton = $('<span title="Remove column" class="removeColumn">x</span>');
removeThreadNameButton.click(function () { 
    injectStyles('td.EventDataCenter#threadname { display: none}'); 
    document.querySelectorAll('td.eventTitleBarStyle[title="Thread"], d.EventDataCenter#threadname').forEach(e => e.remove()) 
});
$('td.eventTitleBarStyle[title="Thread"]').append(removeThreadNameButton);

const removeIntBtn = $('<span title="Remove column" class="removeColumn">x</span>');
removeIntBtn.click(function () { 
    injectStyles('div#traceEvent-CONTAINER table td:nth-child(6) { display: none}'); 
    document.querySelectorAll('td.eventTitleBarStyle[title="Int"], div#traceEvent-CONTAINER table td:nth-child(6)').forEach(e => e.style.display = 'none')
});
$('td.eventTitleBarStyle[title="Int"]').append(removeIntBtn);

const removeElapsedBtn = $('<span title="Remove column" class="removeColumn">x</span>');
removeElapsedBtn.click(function () { 
    injectStyles('div#traceEvent-CONTAINER table td:nth-child(13) { display: none}'); 
    document.querySelectorAll('td.eventTitleBarStyle[title="Elapsed"], div#traceEvent-CONTAINER table td:nth-child(13)').forEach(e => e.style.display = 'none')
});
$('td.eventTitleBarStyle[title="Elapsed"]').append(removeElapsedBtn);

const removeRuleNoBtn = $('<span title="Remove column" class="removeColumn">x</span>');
removeRuleNoBtn.click(function () { 
    injectStyles('div#traceEvent-CONTAINER table td:nth-child(7) { display: none}'); 
    document.querySelectorAll('td.eventTitleBarStyle[title="Rule#"], div#traceEvent-CONTAINER table td:nth-child(7)').forEach(e => e.style.display = 'none')
});
$('td.eventTitleBarStyle[title="Rule#"]').append(removeRuleNoBtn);

const removeAllColumnsBtn = $('<div title="Remove all columns" class="removeColumn">X</div>');
removeAllColumnsBtn.click(function () { 
    $('span.removeColumn').click(); 
    this.remove();
});
$('td.eventTitleBarStyle[title="Line"]').prev().append(removeAllColumnsBtn);