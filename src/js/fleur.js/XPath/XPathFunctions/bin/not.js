/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_bin["not#1"] = new Fleur.Function("http://expath.org/ns/binary", "bin:not",
	function(i) {
		return ~i;
	},
	null, [{type: Fleur.Type_positiveInteger}], false, false, {type: Fleur.Type_positiveInteger});