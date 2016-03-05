/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["head"] = function(ctx, children) {
	if (children.length !== 1) {
		Fleur.error(ctx, "XPST0017");
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1]);
	if (!ctx._result) {
		return;
	} else if (ctx._result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
		return;
	}
	ctx._result = ctx._result.childNodes[0];
};