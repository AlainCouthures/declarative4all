/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["tail"] = function(ctx, children, callback) {
	if (children.length !== 1) {
		callback(Fleur.error(ctx, "XPST0017"));
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
			if (n.childNodes.length > 1) {
				n.childNodes.shift();
			} else {
				n = n.childNodes[0];
			}
		} else {
			n = Fleur.EmptySequence;
		}
		callback(n);
	});
};