/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["substring#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:substring",
	function(source, start) {
		return source.substr(start - 1);
	},
	null, [{type: Fleur.Type_string}, {type: Fleur.Type_integer}], false, false, {type: Fleur.Type_string, occurence: "?"});


Fleur.XPathFunctions_fn["substring#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:substring",
	function(source, start, end) {
		return source.substr(start - 1, end);
	},
	null, [{type: Fleur.Type_string}, {type: Fleur.Type_integer}, {type: Fleur.Type_integer}], false, false, {type: Fleur.Type_string, occurence: "?"});