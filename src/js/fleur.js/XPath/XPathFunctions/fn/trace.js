/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["trace#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:trace",
	function(n) {
		console.log(Fleur.Serializer._serializeNodeToXQuery(n, false, ""));
	},
	null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.EmptySequence});
	
Fleur.XPathFunctions_fn["trace#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:trace",
	function(n, label) {
		console.log((label || "") + Fleur.Serializer._serializeNodeToXQuery(n, false, ""));
	},
	null, [{type: Fleur.Node, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.EmptySequence});
	
Fleur.XPathFunctions_fn["trace#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:trace",
	function(n, label, serialization) {
		var contentType;
		var indent = false;
		if (serialization) {
			var a2 = Fleur.Atomize(serialization);
			var	op2 = Fleur.toJSObject(a2);
			if (op2[0] < 0) {
				return;
			}
			contentType = Fleur.toContentType(op2[1],  "application/xquery");
			indent = op2[1].indent === "yes";
		}
		if (!contentType) {
			contentType = "application/xquery";
		}
		var ser = new Fleur.Serializer();
		console.log((label || "") + ser.serializeToString(n, contentType, indent));
	},
	null, [{type: Fleur.Node, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.EmptySequence});