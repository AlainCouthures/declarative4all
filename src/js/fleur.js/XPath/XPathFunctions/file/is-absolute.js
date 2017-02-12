/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_file["is-absolute#1"] = new Fleur.Function("http://expath.org/ns/file", "file:is-absolute",
	function(path) {
		return global.path ? String(global.path.isAbsolute(path)) : null;
	},
	null, [{type: Fleur.Type_string}], false, false, {type: Fleur.Type_boolean, occurence: "?"});