/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.andOp] = function(ctx, children) {
	var op1, op2;
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1]);
	op1 = Fleur.toJSBoolean(ctx._result);
	if (!op1) {
		ctx._result.data = "false";
		ctx._result.schemaTypeInfo = Fleur.Type_boolean;
	} else {
		Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1]);
		op2 = Fleur.toJSBoolean(ctx._result);
		ctx._result.data = "" + op2[1];
		ctx._result.schemaTypeInfo = Fleur.Type_boolean;
	}
};