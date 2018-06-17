/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["reverse#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:reverse",
	function(arg) {
		if (arg.nodeType === Fleur.Node.SEQUENCE_NODE) {
			var result = new Fleur.Sequence();
			result.nodeType = Fleur.Node.SEQUENCE_NODE;
			var i = arg.childNodes.length - 1;
			while (i >= 0) {
				result.appendChild(arg.childNodes[i]);
				i--;
			}
			return result;
		}
		return arg;
	},
	null, [{type: Fleur.Node, occurence: "*"}], false, false, {type: Fleur.Node, occurence: "*"});