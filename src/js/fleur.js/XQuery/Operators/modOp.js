/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.modOp] = function(ctx, children) {
	var op1, op2, divres;
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1]);
	Fleur.Atomize(ctx);
	op1 = Fleur.toJSNumber(ctx);
	if (op1[0] < 0) {
		return;
	}
	Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1]);
	Fleur.Atomize(ctx);
	op2 = Fleur.toJSNumber(ctx);
	if (op2[0] < 0) {
		return;
	}
	divres = op1[1] / op2[1];
	ctx._result.data = "" + (op1[1] - (Math.floor(divres) + (divres >= 0 ? 0 : 1)) * op2[1]);
	ctx._result.schemaTypeInfo = Fleur.numericTypes[Math.max(op1[0], op2[0])];
};