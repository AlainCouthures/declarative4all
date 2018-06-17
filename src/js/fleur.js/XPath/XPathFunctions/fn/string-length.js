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
		return !ctx._curr ? 0 : ctx._curr.length;
	},
	null, [], true, false, {type: Fleur.Type_integer});

Fleur.XPathFunctions_fn["string-length#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:string-length",
	function(arg) {
		return !arg ? 0 : arg.length;
	},
	null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_integer});