/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["tail#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:tail",
	function(arg) {
		if (arg === Fleur.EmptySequence || arg.nodeType !== Fleur.Node.SEQUENCE_NODE) {
			return Fleur.EmptySequence;
		}
		if (arg.childNodes.length > 2) {
			var result = new Fleur.Sequence();
			for (var i = 1, l = arg.childNodes.length; i < l; i++) {
				result.appendChild(arg.childNodes[i]);
			}
			return result;
		}
		return arg.childNodes[1];
	},
	null, [{type: Fleur.Node, occurence: "*"}], false, false, {type: Fleur.Node, occurence: "*"});