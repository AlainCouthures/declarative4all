/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["string-to-codepoints#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:string-to-codepoints",
	function(arg) {
		if (!arg || arg === "") {
			return null;
		}
		if (arg.length === 1) {
			return arg.codePointAt(0);
		}
		var ret = [];
		var i, l;
		for (i = 0, l = arg.length; i < l; i++) {
			ret.push(arg.codePointAt(i));
		}
		return ret;
	},
	null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_integer, occurence: "*"});