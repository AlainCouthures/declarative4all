/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.rangeSequenceExpr] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var op1;
		var a1 = Fleur.Atomize(n);
		if (a1 === Fleur.EmptySequence) {
			callback(a1);
			return;
		}
		op1 = Fleur.toJSNumber(a1);
		if (op1[0] !== 0) {
			return;
		}
		Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
			var op2;
			var a2 = Fleur.Atomize(n);
			if (a2 === Fleur.EmptySequence) {
				callback(a2);
				return;
			}
			op2 = Fleur.toJSNumber(a2);
			if (op2[0] !== 0) {
				return;
			}
			if (op1[1] > op2[1]) {
				callback(Fleur.EmptySequence);
				return;
			}
			if (op1[1] === op2[1]) {
				callback(a2);
				return;
			}
			var result = new Fleur.Sequence();
			result.nodeType = Fleur.Node.SEQUENCE_NODE;
			while (op1[1] <= op2[1]) {
				var i = new Fleur.Text();
				i.schemaTypeInfo = Fleur.Type_integer;
				i.data = "" + op1[1];
				result.appendChild(i);
				op1[1]++;
			}
			callback(result);
		});
	});
};