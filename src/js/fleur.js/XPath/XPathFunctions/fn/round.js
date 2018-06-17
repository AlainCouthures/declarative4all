/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["round#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:round",
	function(arg) {
		if (arg === null) {
			return [null, null];
		}
		var a = arg[0];
		var t = arg[1];
		var a2, t2;
		a2 = Math.round(a);
		t2 = t;
		return [a2, t2];
	},
	null, [{type: Fleur.numericTypes, adaptative: true, occurence: "?"}], false, false, {type: Fleur.numericTypes, adaptative: true, occurence: "?"});

Fleur.XPathFunctions_fn["round#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:round",
	function(arg, precision) {
		if (arg === null) {
			return [null, null];
		}
		var a = arg[0];
		var t = arg[1];
		var a2, t2;
		a2 = Math.round(a * Math.pow(10, precision) + Math.pow(10, Math.floor(Math.log(Math.abs(a)) * Math.LOG10E) + precision - 15)) / Math.pow(10, precision);
		t2 = t;
		return [a2, t2];
	},
	null, [{type: Fleur.numericTypes, adaptative: true, occurence: "?"}, {type: Fleur.Type_integer}], false, false, {type: Fleur.numericTypes, adaptative: true, occurence: "?"});