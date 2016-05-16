/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["one-or-more"] = function(ctx, children, callback) {
	if (children.length !== 1) {
		callback(Fleur.error(ctx, "XPST0017"));
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		if (n === Fleur.EmptySequence) {
			callback(Fleur.error(ctx, "FORG0004"));
			return;
		}
		if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
			var result = n;
			n.childNodes.forEach(function(c) {
				if (c.schemaTypeInfo === Fleur.Type_error && result === n) {
					result = c;
				}
			});
			callback(result);
		} else {
			callback(n);
		}
	});
};