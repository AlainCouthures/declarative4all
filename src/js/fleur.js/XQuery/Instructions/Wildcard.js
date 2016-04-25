/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.Wildcard] = function(ctx, children, callback) {
	if (children[0]) {
		if (children[0][0] === Fleur.XQueryX.star && children[1][0] === Fleur.XQueryX.NCName) {
			if (ctx._curr.localName !== children[1][1][0]) {
				callback(Fleur.EmptySequence);
				return;
			}
		}
	}
	callback(ctx._curr.nodeType !== Fleur.Node.ELEMENT_NODE && ctx._curr.nodeType !== Fleur.Node.ATTRIBUTE_NODE && ctx._curr.nodeType !== Fleur.Node.ENTRY_NODE ? Fleur.EmptySequence : ctx._curr);
};