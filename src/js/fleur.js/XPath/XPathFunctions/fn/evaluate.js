/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["evaluate#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:evaluate",
	function(arg) {
		return arg !== Fleur.EmptySequence;
	},
	null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Node, occurence: "*"});