/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["translate#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:translate",
	function(arg, mapString, transString) {
		var res = "", i, j, l, tl = transString.length;
		if (arg === null) {
			return "";
		}
		for (i = 0, l = arg.length; i < l; i++) {
			j = mapString.indexOf(arg.charAt(i));
			if (j !== -1) {
				if (j < tl) {
					res += transString.charAt(j);
				}
			} else {
				res += arg.charAt(i);
			}
		}
		return res;
	},
	null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_string});