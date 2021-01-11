var CopyName = function CopyName() {
    let xml = $('textarea#PRXML').val().replace('<?xml version="1.0" ?>', '').replace("<?xml version='1.0' ?>", "");
    $xml = $($.parseXML(xml));
    let copyText = $xml.find("pyRuleName")[0].textContent;
    copyText = copyText + ' \t' + $xml.find("pyClassName")[0].textContent;
    copyText = copyText + ' \t' + $xml.find("pyRuleSet")[0].textContent;
    if (!$xml.find("pyRuleSet")[0].textContent.includes("Branch"))
        copyText = copyText + ' [' + $xml.find("pyRuleSetVersion")[0].textContent + ']';

    copyToClipboard(copyText);
    return false;
}

$('div[node_name="pzLocalDataStorageWrapper"] div.header-right').append('<a onclick="pd(event);" data-ctl="Link" data-click="[[&quot;refresh&quot;, [&quot;thisSection&quot;,&quot;&quot;, &quot;&quot;, &quot;&amp;=&quot;, &quot;&quot;, &quot;,&quot;,&quot;:event&quot;,&quot;&quot;]]]">Refresh</a>');
$('div[node_name="pzRecordEditor"] table div#PEGA_GRID_SKIN td').eq(1).append('<a data-test-id="2016072109232603516456" href="#" onclick="pd(event);" data-ctl="Link" name="pzRecordEditor_D_pzRecordsEditor_4" data-click="[[&quot;refresh&quot;, [&quot;thisSection&quot;,&quot;&quot;, &quot;&quot;, &quot;&amp;=&quot;, &quot;&quot;, &quot;,&quot;,&quot;:event&quot;,&quot;&quot;,&quot;D_pzRecordsEditor_pa1391986709661278pz&quot;]]]" class="">Refresh</a>');

appendScript(copyToClipboard);
var script = document.createElement('script');
script.textContent = CopyName;
(document.head || window.documentElement).appendChild(script);
$('div[node_name="pzDataTypeKeysAndDescription"] a').eq(1).after('<a class="rule-details" style="margin-top:0; margin-bottom:0;padding-bottom: 3px;padding-top: 0;" href="#" onclick="return CopyName()"><i  class="icons pi pi-copy" id="CopyName" alt="Copy name"></i></a>');