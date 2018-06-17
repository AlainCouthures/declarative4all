/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["string#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:string",
	function(ctx) {
		return Fleur.XPathFunctions_fn["string#1"].jsfunc(ctx._curr);
	},
	null, [], true, false, {type: Fleur.Type_string});

Fleur.XPathFunctions_fn["string#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:string",
	function(arg) {
		if (arg === Fleur.EmptySequence) {
			return "";
		}
		var a = Fleur.Atomize(arg);
		return a.data;
	},
	null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_string});