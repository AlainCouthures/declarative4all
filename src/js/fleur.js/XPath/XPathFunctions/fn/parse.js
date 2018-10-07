/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["parse#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:parse",
	function(arg, serialization) {
		var contentType;
		if (serialization) {
			var a2 = Fleur.Atomize(serialization);
			var	op2 = Fleur.toJSObject(a2);
			if (op2[0] < 0) {
				callback(a2);
				return;
			}
			serialization = op2[1];
			contentType = Fleur.toContentType(serialization);
		} else {
			contentType = "application/xml";
		}
		var parser = new Fleur.DOMParser();
		return arg !== null ? parser.parseFromString(arg, contentType) : null;
	},
	null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Node, occurence: "?"});