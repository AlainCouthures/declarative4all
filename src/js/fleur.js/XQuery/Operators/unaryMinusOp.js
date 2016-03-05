/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.unaryMinusOp] = function(ctx, children) {
	var op;
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1]);
	Fleur.Atomize(ctx);
	op = Fleur.toJSNumber(ctx);
	if (op[0] < 0) {
		return;
	}
	ctx._result.data = "" + (- op[1]);
};