/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.rangeSequenceExpr] = function(ctx, children) {
	var op1, op2;
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1]);
	Fleur.Atomize(ctx);
	if (!ctx._result) {
		return;
	}
	op1 = Fleur.toJSNumber(ctx);
	if (op1[0] !== 0) {
		return;
	}
	Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1]);
	Fleur.Atomize(ctx);
	if (!ctx._result) {
		return;
	}
	op2 = Fleur.toJSNumber(ctx);
	if (op2[0] !== 0) {
		return;
	}
	if (op1[1] > op2[1]) {
		ctx._result = null;
		return;
	}
	if (op1[1] === op2[1]) {
		return;
	}
	ctx._result = new Fleur.Sequence();
	ctx._result.nodeType = Fleur.Node.SEQUENCE_NODE;
	while (op1[1] <= op2[1]) {
		var n = new Fleur.Text();
		n.schemaTypeInfo = Fleur.Type_integer;
		n.data = "" + op1[1];
		ctx._result.appendChild(n);
		op1[1]++;
	}
};