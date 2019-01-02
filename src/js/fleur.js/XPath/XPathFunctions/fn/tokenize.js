/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["tokenize#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:tokenize",
	function(input) {
		if (!input || input === "") {
			return null;
		}
		input = input.split(" ");
		if (input[0] === "") {
			input.splice(0, 1);
		}
		if (input[input.length - 1] === "") {
			input.pop();
		}
		return input.length === 1 ? input[0] : input;
	},
	null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_string, occurence: "*"});

Fleur.XPathFunctions_fn["tokenize#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:tokenize",
	function(input, pattern) {
		return Fleur.XPathFunctions_fn["tokenize#3"].jsfunc(input, pattern, "");
	},
	null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_string, occurence: "*"});

Fleur.XPathFunctions_fn["tokenize#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:tokenize",
	function(input, pattern, flags) {
		pattern = new RegExp(pattern, flags);
		if (!input || input === "") {
			return null;
		}
		input = input.split(pattern);
		var result = [];
		input.forEach(function(t) {
			if (t !== undefined && !pattern.test(t)) {
				result.push(t);
			}
		});
		return result.length === 0 ? "" : result.length === 1 ? result[0] : result;
	},
	null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_string, occurence: "*"});