/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_file["is-file#1"] = new Fleur.Function("http://expath.org/ns/file", "is-file",
	function(path, callback) {
		if (!global.fs) {
			callback(null);
			return;
		}
		global.fs.stat(path, function(err, stats) {
			callback(!err && stats.isFile());
		});
	},
	null, [{type: Fleur.Type_string}], false, true, {type: Fleur.Type_boolean, occurence: "?"});