/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_zip["inflate#1"] = new Fleur.Function("http://expath.org/ns/zip", "zip:inflate",
	function(arg) {
		return Fleur.bin2utf8(Fleur.inflate(arg));
	},
	null, [{type: Fleur.Type_string}], false, false, {type: Fleur.Type_string});