function formatJava() {
	var editor = pega.ui.CodeEditorUtils.getLatestEditor();
	CodeMirror.commands["selectAll"](editor);
	autoFormatSelection(editor);
}

function getSelectedRange(editor) {
	return { from: editor.getCursor(true), to: editor.getCursor(false) };
}

function autoFormatSelection(editor) {
	var range = getSelectedRange(editor);
	editor.autoFormatRange(range.from, range.to);
}

function newlineAfterToken(type, content, textAfter, state) {
	if (content == ";" && state.lexical && state.lexical.type == ")")
		return false;
	return /^[;{}]$/.test(content) && !/^;/.test(textAfter);
}

// Applies automatic formatting to the specified range
CodeMirror.defineExtension("autoFormatRange", function (from, to) {
	var cm = this;
	var outer = cm.getMode(),
		text = cm.getRange(from, to).split("\n");
	var state = CodeMirror.copyState(outer, cm.getTokenAt(from).state);
	var tabSize = cm.getOption("tabSize");

	var out = "",
		lines = 0,
		atSol = from.ch == 0;
	function newline() {
		out += "\n";
		atSol = true;
		++lines;
	}

	for (var i = 0; i < text.length; ++i) {
		var stream = new CodeMirror.StringStream(text[i], tabSize);
		while (!stream.eol()) {
			var inner = CodeMirror.innerMode(outer, state);
			var style = outer.token(stream, state),
				cur = stream.current();
			stream.start = stream.pos;
			if (!atSol || /\S/.test(cur)) {
				out += cur;
				atSol = false;
			}
			if (
				!atSol &&
				newlineAfterToken(
					style,
					cur,
					stream.string.slice(stream.pos) || text[i + 1] || "",
					inner.state
				)
			)
				newline();
		}
		if (!stream.pos && outer.blankLine) outer.blankLine(state);
		if (!atSol) newline();
	}

	cm.operation(function () {
		cm.replaceRange(out, from, to);
		for (var cur = from.line + 1, end = from.line + lines; cur <= end; ++cur)
			cm.indentLine(cur, "smart");
		cm.setSelection(from, cm.getCursor(false));
	});
});

console.log("PDT: formatJava.js loaded");
