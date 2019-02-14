/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["floor#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:floor",
	function(a) {
		return a ? [typeof a[0] === "bigint" ? a[0] : Math.floor(a[0]), a[1]] : null;
	},
	null, [{type: Fleur.numericTypes, adaptative: true, occurence: "?"}], false, false, {type: Fleur.numericTypes, adaptative: true, occurence: "?"});