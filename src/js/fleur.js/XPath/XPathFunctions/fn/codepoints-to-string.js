/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["codepoints-to-string#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:codepoints-to-string",
	function(arg) {
		if (arg === null) {
			return "";
		}
		if (arg instanceof Array) {
			try {
				return arg.reduce(function(a, v) {
					if (v < 1 || v > 655535) {
						var e = new Error("codepoints-to-string(): the input contains an integer that is not the codepoint of a valid XML character");
						e.name = "FOCH0001";
						throw e;
					}
					return a + String.fromCodePoint(v);
				}, "");
			} catch(err) {
				return err;
			}
		}
		if (arg < 1 || arg > 655535) {
			var e = new Error("codepoints-to-string(): the input contains an integer that is not the codepoint of a valid XML character");
			e.name = "FOCH0001";
			return e;
		}
		return String.fromCodePoint(arg);
	},
	null, [{type: Fleur.Type_integer, occurence: "*"}], false, false, {type: Fleur.Type_string});