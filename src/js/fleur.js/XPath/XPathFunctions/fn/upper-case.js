/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["upper-case#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:upper-case",
	function(arg) {
		return arg ? arg.toUpperCase() : "";
	},
	null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_string});