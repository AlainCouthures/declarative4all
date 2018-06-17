/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["zero-or-one#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:zero-or-one",
	function(arg, ctx) {
		if (arg.nodeType === Fleur.Node.SEQUENCE_NODE && arg.childNodes && arg.childNodes.length > 1) {
			return Fleur.error(ctx, "FORG0003");
		}
		return arg;
	},
	null, [{type: Fleur.Node, occurence: "*"}], true, false, {type: Fleur.Node});