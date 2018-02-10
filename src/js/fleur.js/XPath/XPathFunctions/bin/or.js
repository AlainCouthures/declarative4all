/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_bin["or#2"] = new Fleur.Function("http://expath.org/ns/binary", "bin:or",
	function(a, b) {
		return a | b;
	},
	null, [{type: Fleur.Type_positiveInteger}, {type: Fleur.Type_positiveInteger}], false, false, {type: Fleur.Type_positiveInteger});