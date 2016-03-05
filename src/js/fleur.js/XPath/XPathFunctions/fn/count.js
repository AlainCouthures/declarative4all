/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["count"] = function(ctx, children) {
	if (children.length !== 1) {
		Fleur.error(ctx, "XPST0017");
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1]);
	var count;
	if (!ctx._result) {
		count = 0;
	} else if (ctx._result.nodeType !== Fleur.Node.SEQUENCE_NODE && ctx._result.nodeType !== Fleur.Node.ARRAY_NODE) {
		count = 1;
	} else {
		count = ctx._result.childNodes.length;
	}
	ctx._result = new Fleur.Text();
	ctx._result.data = "" + count;
	ctx._result.schemaTypeInfo = Fleur.Type_integer;
};