/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["id#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:id",
	function(arg, ctx) {
		return Fleur.XPathFunctions_fn["id#2"].jsfunc(arg, ctx._curr);
	},
	null, [{type: Fleur.Type_string, occurence: "*"}], true, false, {type: Fleur.Node, occurence: "*"});

Fleur.XPathFunctions_fn["id#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:id",
	function(arg, node) {
		if (!arg || !node || (!node.ownerDocument && node.nodeType !== Fleur.Node.DOCUMENT_NODE)) {
			return null;
		}
		node = node.ownerDocument || node;
		if (arg instanceof Array) {
			var res = [];
			arg.forEach(function(id) {
				var elt = node.getElementById(id);
				if (elt) {
					res.push(elt);
				}
			});
			return res.length === 0 ? null : res.length === 1 ? res[0] : node.sortNodes(res);
		}
		return node.getElementById(arg);
	},
	null, [{type: Fleur.Type_string, occurence: "*"}, {type: Fleur.Node}], false, false, {type: Fleur.Node, occurence: "*"});