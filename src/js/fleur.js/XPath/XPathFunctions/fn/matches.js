/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["matches#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:matches",
	function(input, pattern) {
		return Fleur.XPathFunctions_fn["matches#3"].jsfunc(input, pattern);
	},
	null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_boolean});

Fleur.XPathFunctions_fn["matches#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:matches",
	function(input, pattern, flags) {
			input = input || "";
			flags = flags || "";
			try {
				var re = new RegExp(pattern, flags);
				return re.test(input);
			} catch (e) {
				return false;
			}
	},
	null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string}, {type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_boolean});