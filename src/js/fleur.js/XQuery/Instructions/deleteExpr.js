/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.deleteExpr] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var i, l;
		if (n !== Fleur.EmptySequence) {
			if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
				for (i = 0, l = n.childNodes.length; i < l; i++) {
					if (n.childNodes[i].parentElement) {
						if (n.childNodes[i].nodeType === Fleur.Node.ATTRIBUTE_NODE) {
							n.childNodes[i].parentElement.removeAttributeNode(n.childNodes[i]);
						} else {
							n.childNodes[i].parentElement.removeChild(n.childNodes[i]);
						}
					}
				}
			} else if (n.parentElement) {
				if (n.nodeType === Fleur.Node.ATTRIBUTE_NODE) {
					n.parentElement.removeAttributeNode(n);
				} else {
					n.parentElement.removeChild(n);
				}
			}
		}
		Fleur.callback(function() {callback(Fleur.EmptySequence);});
	});
};