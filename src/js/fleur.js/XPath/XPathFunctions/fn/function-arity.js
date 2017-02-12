/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["function-arity#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:function-arity",
	function(f) {
		return f.argtypes.length;
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Type_integer});