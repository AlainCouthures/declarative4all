/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["tail"] = function(ctx, children) {
	var i;
	if (children.length !== 1) {
		Fleur.error(ctx, "XPST0017");
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1]);
	if (ctx._result.nodeType === Fleur.Node.SEQUENCE_NODE) {
		if (ctx._result.childNodes.length > 1) {
			ctx._result.childNodes.shift();
		} else {
			ctx._result = ctx._result.childNodes[0];
		}
	} else {
		ctx._result = null;
	}
};