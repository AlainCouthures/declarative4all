/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_file["copy#2"] = new Fleur.Function("http://expath.org/ns/file", "file:copy",
	function(source, target, callback) {
		if (!global.fs) {
			callback(null);
			return;
		}
		global.fs.copyFile(source, target, function(err) {
			callback(err ? err : null);
		});
	},
	null, [{type: Fleur.Type_string}, {type: Fleur.Type_string}], false, true, {type: Fleur.EmptySequence});