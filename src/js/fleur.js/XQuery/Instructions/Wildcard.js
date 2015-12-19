/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.Wildcard] = function(ctx, children) {
	if (children[0]) {
		if (children[0][0] === Fleur.XQueryX.star && children[1][0] === Fleur.XQueryX.NCName) {
			if (ctx._stepctx.curr.localName !== children[1][1][0]) {
				if (ctx._stepctx.curr.nodeType === Fleur.Node.ATTRIBUTE_NODE) {
					ctx._stepctx.curr = ctx._stepctx.curr.ownerElement.getAttributeNode(children[1][1][0]);
					ctx._stepctx.continue = null;
					return;
				}
				ctx._stepctx.ignore = true;
				return;
			}
		}
	}
	if (ctx._stepctx.curr.nodeType !== Fleur.Node.ELEMENT_NODE && ctx._stepctx.curr.nodeType !== Fleur.Node.ATTRIBUTE_NODE && ctx._stepctx.curr.nodeType !== Fleur.Node.ENTRY_NODE) {
		ctx._stepctx.ignore = true;
	}
};