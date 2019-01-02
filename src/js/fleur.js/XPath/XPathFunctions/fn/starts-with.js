/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["starts-with#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:starts-with",
	function(a, b) {
		return !b ? true : !a ? false : a.startsWith(b);
	},
	null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_boolean});

Fleur.XPathFunctions_fn["starts-with#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:starts-with",
	function(a, b, collation) {
		var c = Fleur.getCollation(collation);
		if (!c) {
			var e = new Error("");
			e.name = "FOCH0002";
			return e;
		}
		return !b ? true : !a ? false : c.startsWith(a, b);
	},
	null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_boolean});