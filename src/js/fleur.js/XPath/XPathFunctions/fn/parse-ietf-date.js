/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["parse-ietf-date#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:parse-ietf-date",
	function(value) {
		return value ? new Date(value) : null;
	},
	null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_dateTime});