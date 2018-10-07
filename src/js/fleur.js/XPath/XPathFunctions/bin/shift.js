/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_bin["shift#2"] = new Fleur.Function("http://expath.org/ns/binary", "bin:shift",
	function(i, by) {
		return by > 0 ? i << by : by < 0 ? i >> by : i;
	},
	null, [{type: Fleur.Type_nonNegativeInteger}, {type: Fleur.Type_nonNegativeInteger}], false, false, {type: Fleur.Type_nonNegativeInteger});