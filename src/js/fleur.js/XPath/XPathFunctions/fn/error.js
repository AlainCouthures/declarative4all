/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["error"] = function(ctx, children) {
	if (children.length === 0) {
		Fleur.error(ctx, "FOER0000");
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1]);
	Fleur.Atomize(ctx);
	if (ctx._result.schemaTypeInfo === Fleur.Type_error) {
		return;
	}
	if (ctx._result.schemaTypeInfo !== Fleur.Type_QName) {
		Fleur.error(ctx, "XPTY0004");
		return;
	}
	ctx._result.schemaTypeInfo = Fleur.Type_error;
};
