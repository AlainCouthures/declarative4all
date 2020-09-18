/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["replace#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:replace",
	function(input, pattern, replacement) {
		return Fleur.XPathFunctions_fn["replace#4"].jsfunc(input, pattern, replacement);
	},
	null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_string});

Fleur.XPathFunctions_fn["replace#4"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:replace",
	function(input, pattern, replacement, flags) {
			input = input || "";
			flags = (flags || "") + "g";
			try {
				var re = new RegExp(pattern, flags);
				return input.replace(re, replacement);
			} catch (e) {
				return input;
			}
	},
	null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string}, {type: Fleur.Type_string}, {type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_string});