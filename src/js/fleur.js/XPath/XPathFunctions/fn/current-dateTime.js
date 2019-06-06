/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["current-dateTime#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:current-dateTime",
	function(ctx) {
		return ctx.env.now;
	},
	null, [], true, false, {type: Fleur.Type_dateTime});