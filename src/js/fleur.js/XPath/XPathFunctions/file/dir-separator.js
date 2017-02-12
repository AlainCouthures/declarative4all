/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_file["dir-separator#0"] = new Fleur.Function("http://expath.org/ns/file", "file:dir-separator",
	function() { return global.path ? global.path.sep : null; },
	null, [], false, false, {type: Fleur.Type_string, occurence: "?"});