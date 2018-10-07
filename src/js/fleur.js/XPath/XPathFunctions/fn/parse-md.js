/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["parse-md#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:parse-md",
	function(arg) {
		var parser = new Fleur.DOMParser();
		return arg !== null ? parser.parseFromString(arg, "text/markdown") : null;
	},
	null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Node, occurence: "?"});