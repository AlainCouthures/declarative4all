/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_file["resolve-path#1"] = new Fleur.Function("http://expath.org/ns/file", "file:resolve-path",
	function(path) {
		if (!global.path) {
			return;
		}
		return global.path.resolve(path);
	},
	null, [{type: Fleur.Type_string}], false, false, {type: Fleur.Type_string});