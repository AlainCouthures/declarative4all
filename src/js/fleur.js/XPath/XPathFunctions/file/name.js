/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_file["name#1"] = new Fleur.Function("http://expath.org/ns/file", "name",
	function(path) {
		var spl = path.replace("\\", "/").split("/");
		if (spl.length > 0) {
			return spl[spl.length - 1];
		}
		return "";
	},
	null, [{type: Fleur.Type_string}], false, false, {type: Fleur.Type_string});