/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["one-or-more#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:one-or-more",
	function(arg, ctx) {
		if (arg === Fleur.EmptySequence) {
			return Fleur.error(ctx, "FORG0004");
		}
		if (arg.nodeType === Fleur.Node.SEQUENCE_NODE) {
			var result = arg;
			arg.childNodes.forEach(function(c) {
				if (c.schemaTypeInfo === Fleur.Type_error && result === arg) {
					result = c;
				}
			});
			return result;
		} else {
			return arg;
		}
	},
	null, [{type: Fleur.Node, occurence: "*"}], true, false, {type: Fleur.Node});