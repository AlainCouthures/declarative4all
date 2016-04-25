/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.stringConcatenateOp] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var op1;
		var a1 = Fleur.Atomize(n);
		op1 = Fleur.toJSString(a1);
		if (op1[0] < 0) {
			callback(a1);
			return;
		}
		Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
			var op2;
			var a2 = Fleur.Atomize(n);
			op2 = Fleur.toJSString(a2);
			if (op2[0] < 0) {
				callback(a2);
				return;
			}
			a1.data = "" + (op1[1] + op2[1]);
			a1.schemaTypeInfo = Fleur.Type_string;
			callback(a1);
		});
	});
};