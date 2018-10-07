/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["current#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:current",
	function(ctx) {
		return ctx._item || ctx._curr;
	},
	null, [], true, false, {type: Fleur.Node});