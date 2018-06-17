/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["seconds-from-time#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:seconds-from-time",
	function(arg) {
		return arg !== null ? parseInt(arg.match(/^\d{2}:\d{2}:(\d{2}(?:\.\d+)?)(?:Z|[+\-]\d{2}:\d{2})?$/)[1], 10) : null;
	},
	null, [{type: Fleur.Type_time, occurence: "?"}], true, false, {type: Fleur.Type_integer, occurence: "?"});