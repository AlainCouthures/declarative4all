/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_file["path-separator#0"] = new Fleur.Function("http://expath.org/ns/file", "path-separator",
	function() { return global.path ? global.path.delimiter : null; },
	null, [], false, false, {type: Fleur.Type_string, occurence: "?"});