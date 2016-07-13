/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["reverse"] = function(ctx, children, callback) {
	var i;
	if (children.length !== 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
			var result = new Fleur.Sequence();
			result.nodeType = Fleur.Node.SEQUENCE_NODE;
			i = n.childNodes.length - 1;
			while (i >= 0) {
				result.appendChild(n.childNodes[i]);
				i--;
			}
			Fleur.callback(function() {callback(result);});
		} else {
			Fleur.callback(function() {callback(n);});
		}
	});
};