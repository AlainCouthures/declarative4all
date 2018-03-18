/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["codepoint-equal#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:codepoint-equal",
	function(comparand1, comparand2) {
		return comparand1 === null || comparand2 === null ? null : comparand1 === comparand2;
	},
	null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_boolean, occurence: "?"});