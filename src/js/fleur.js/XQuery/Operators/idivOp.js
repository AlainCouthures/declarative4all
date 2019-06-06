/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.idivOp] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var op1;
		var a1 = Fleur.Atomize(n);
		op1 = Fleur.toJSNumber(a1);
		if (op1[0] < 0) {
			Fleur.callback(function() {callback(a1);});
			return;
		}
		Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
			var op2, divres;
			var a2 = Fleur.Atomize(n);
			op2 = Fleur.toJSNumber(a2);
			if (op2[0] < 0) {
				Fleur.callback(function() {callback(a2);});
				return;
			}
			divres = typeof op1[1] === typeof op2[1] ? op1[1] / op2[1] : Number(op2[1]) / Number(op1[1]);
			a1.data = String(typeof divres === "number" ? Math.floor(divres) + (divres >= 0 ? 0 : 1) : divres + Fleur.BigInt(divres >= 0 ? 0 : 1));
			a1.schemaTypeInfo = Fleur.Type_integer;
			Fleur.callback(function() {callback(a1);});
		});
	});
};
