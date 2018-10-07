/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_bin["and#2"] = new Fleur.Function("http://expath.org/ns/binary", "bin:and",
	function(a, b) {
		return a & b;
	},
	null, [{type: Fleur.Type_nonNegativeInteger}, {type: Fleur.Type_nonNegativeInteger}], false, false, {type: Fleur.Type_nonNegativeInteger});