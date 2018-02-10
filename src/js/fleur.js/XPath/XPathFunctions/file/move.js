/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_file["move#2"] = new Fleur.Function("http://expath.org/ns/file", "file:move",
	function(source, target, callback) {
		if (!global.fs) {
			callback(null);
			return;
		}
		global.fs.rename(source, target, function(err) {
			callback(!err);
		});
	},
	null, [{type: Fleur.Type_string}, {type: Fleur.Type_string}], false, true, {type: Fleur.EmptySequence});