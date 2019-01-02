/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["string-length#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:string-length",
	function(ctx) {
		if (!ctx._curr) {
			return 0;
		}
		var a = Fleur.Atomize(ctx._curr);
		return a.data.length;
	},
	null, [], true, false, {type: Fleur.Type_integer});

Fleur.XPathFunctions_fn["string-length#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:string-length",
	function(arg) {
		return !arg ? 0 : arg.length;
	},
	null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_integer});