/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_file["temp-dir#0"] = new Fleur.Function("http://expath.org/ns/file", "file:temp-dir",
	function() { return global.os ? global.os.tmpdir() : null; },
	null, [], false, false, {type: Fleur.Type_string, occurence: "?"});