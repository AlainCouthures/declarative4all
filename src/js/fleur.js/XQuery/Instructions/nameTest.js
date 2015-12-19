/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.nameTest] = function(ctx, children) {
	if (ctx._stepctx.curr.localName !== children[0]) {
		if (ctx._stepctx.curr.nodeType === Fleur.Node.ATTRIBUTE_NODE) {
			ctx._stepctx.curr = ctx._stepctx.curr.ownerElement.getAttributeNode(children[0]);
			ctx._stepctx.continue = null;
			return;
		}
		ctx._stepctx.ignore = true;
		return;
	}
	var nsURI;
	if (children.length === 1) {
		nsURI = "";
	} else {
		nsURI = children[1][1][0];
	}
	if (ctx._stepctx.curr.namespaceURI !== ctx.nsresolver.lookupNamespaceURI(nsURI)) {
		if (ctx._stepctx.curr.nodeType === Fleur.Node.ATTRIBUTE_NODE) {
			ctx._stepctx.curr = ctx._stepctx.curr.ownerElement.getAttributeNode(children[0]);
			ctx._stepctx.continue = null;
			return;
		}
		ctx._stepctx.ignore = true;
		return;
	}
};
