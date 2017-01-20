/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_file["last-modified#1"] = new Fleur.Function("http://expath.org/ns/file", "last-modified",
	function(path, callback) {
		if (!global.fs) {
			callback(null);
			return;
		}
		global.fs.stat(path, function(err, stats) {
			if (!err) {
				callback(stats.mtime);
				return;
			}
			callback(null);
		});
	},
	null, [{type: Fleur.Type_string}], false, true, {type: Fleur.Type_dateTime, occurence: "?"});