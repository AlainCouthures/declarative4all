/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_neOp = function(children) {
	return this.gen(children[0][1][0], Fleur.atomicTypes) + this.gen(children[1][1][0], Fleur.atomicTypes) + this.inst("xqx_valueComp(Fleur.neOp)");
};

Fleur.neOp = function(op1, op2, c) {
	if (op1[0] < 4) {
		return op1[1] !== op2[1];
	}
	if (op1[0] === 4) {
		return !c.equals(op1[1], op2[1]);
	}
	if (op1[0] === 5 && op2[0] === 5) {
		return op1[1] !== op2[1];
	}
	if (op1[0] > 5 && op1[0] < 9) {
		var d1 = op1[1].d;
		d1.setMinutes(d1.getMinutes() - op1[1].tz);
		var d2 = op2[1].d;
		d2.setMinutes(d2.getMinutes() - op2[1].tz);
		return d1.getTime() !== d2.getTime();
	}
	if (op1[0] === 9) {
		return op1[1].sign * (op1[1].year * 12 + op1[1].month) !== op2[1].sign * (op2[1].year * 12 + op2[1].month);
	}
	if (op1[0] === 10) {
		return op1[1].sign * (((op1[1].day * 24 + op1[1].hour) * 60 + op1[1].minute) * 60 + op1[1].second) !== op2[1].sign * (((op2[1].day * 24 + op2[1].hour) * 60 + op2[1].minute) * 60 + op2[1].second);
	}
	return false;
};
Fleur.XQueryEngine[Fleur.XQueryX.neOp] = function(ctx, children, callback) {
	Fleur.XPathTestOpFunction(ctx, children, Fleur.neOp, callback);
};