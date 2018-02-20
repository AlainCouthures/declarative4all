/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_file["create-dir#1"] = new Fleur.Function("http://expath.org/ns/file", "file:create-dir",
	function(dir, callback) {
		if (!global.fs) {
			callback(null);
			return;
		}
		global.fs.mkdir(dir, function(err) {
			callback(err ? err : null);
		});
	},
	null, [{type: Fleur.Type_string}], false, true, {type: Fleur.EmptySequence});