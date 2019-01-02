/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["contains-token#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:contains-token",
	function(input, token) {
		return Fleur.XPathFunctions_fn["contains-token#3"].jsfunc(input, token, "http://www.w3.org/2005/xpath-functions/collation/codepoint");
	},
	null, [{type: Fleur.Type_string, occurence: "*"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_boolean});

Fleur.XPathFunctions_fn["contains-token#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:contains-token",
	function(input, token, collation) {
		var c = Fleur.getCollation(collation);
		if (!c) {
			var e = new Error("");
			e.name = "FOCH0002";
			return e;
		}
		if (!input || input === "") {
			return false;
		}
		token = token.trim();
		if (token === "") {
			return false;
		}
		if (!(input instanceof Array)) {
			input = [input];
		}
		for (var i1 = 0, l1 = input.length; i1 < l1; i1++) {
			input[i1] = input[i1].split(" ");
			for (var i2 = 0, l2 = input[i1].length; i2 < l2; i2++) {
				if ( c.equals(input[i1][i2], token)) {
					return true;
				}
			}
		}
		return false;
	},
	null, [{type: Fleur.Type_string, occurence: "*"}, {type: Fleur.Type_string}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_boolean});