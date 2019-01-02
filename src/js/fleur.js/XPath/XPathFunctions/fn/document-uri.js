/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["document-uri#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:document-uri",
	function(ctx) {
		return Fleur.XPathFunctions_fn["document-uri#1"].jsfunc(ctx._curr);
	},
	null, [], true, false, {type: Fleur.Type_anyURI});

Fleur.XPathFunctions_fn["document-uri#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:document-uri",
	function(node) {
		if (node === Fleur.EmptySequence) {
			return null;
		}
		if ((node.nodeType === Fleur.Node.TEXT_NODE && node.schemaTypeInfo !== Fleur.Type_untypedAtomic) || node.nodeType === Fleur.Node.FUNCTION_NODE) {
			var e = new Error("");
			e.name = "XPTY0004";
			return e;
		}
		return "";
	},
	null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_anyURI});