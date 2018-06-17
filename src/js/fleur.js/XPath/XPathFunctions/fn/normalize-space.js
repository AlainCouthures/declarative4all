/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["normalize-space#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:normalize-space",
	function(ctx) {
		return ctx._curr ? ctx._curr.textContent.replace(/^\s+|\s+$/g, "").replace(/\s+/g, " ") : "";
	},
	null, [], true, false, {type: Fleur.Type_string});

Fleur.XPathFunctions_fn["normalize-space#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:normalize-space",
	function(arg) {
		return arg ? arg.replace(/^\s+|\s+$/g, "").replace(/\s+/g, " ") : "";
	},
	null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_string});