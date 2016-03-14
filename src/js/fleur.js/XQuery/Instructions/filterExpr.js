/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.filterExpr] = function(ctx, children) {
	var res = ctx._result;
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1]);
	ctx._stepctx.curr = ctx._result;
	ctx._result = res;
};