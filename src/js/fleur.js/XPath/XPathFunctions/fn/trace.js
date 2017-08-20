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
	null, [{type: Fleur.Node}], false, false, {type: Fleur.EmptySequence});
	
Fleur.XPathFunctions_fn["trace#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:trace",
	function(n, label) {
		console.log(label + Fleur.Serializer._serializeNodeToXQuery(n, false, ""));
	},
	null, [{type: Fleur.Node}, {type: Fleur.Type_string}], false, false, {type: Fleur.EmptySequence});