/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_modOp = function(children) {
	return this.gen(children[0][1][0], Fleur.atomicTypes) + this.gen(children[1][1][0], Fleur.atomicTypes) + this.inst("xqx_modOp()");
};

Fleur.Context.prototype.xqx_modOp = function() {
  const arg1 = this.itemstack.pop();
  const arg2 = this.item;
  const op1 = Fleur.toJSNumber(arg1);
  if (op1[0] < 0) {
    this.item = arg1;
    return this;
  }
  const op2 = Fleur.toJSNumber(arg2);
  if (op2[0] < 0) {
    return this;
  }
  if (typeof op1[1] !== typeof op2[1]) {
    op1[1] = Number(op1[1]);
    op2[1] = Number(op2[1]);
  }
  const divres = op1[1] / op2[1];
  this.item.data = String(op1[1] - ((typeof divres === "number" ? Math.floor(divres) : divres) + Fleur.BigInt(divres >= 0 ? 0 : 1)) * op2[1]);
  this.schemaTypeInfo = Fleur.numericTypes[Math.max(op1[0], op2[0])];
  return this;
};

 Fleur.XQueryEngine[Fleur.XQueryX.modOp] = function(ctx, children, callback) {
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
			if (typeof op1[1] !== typeof op2[1]) {
				op1[1] = Number(op1[1]);
				op2[1] = Number(op2[1]);
			}
			divres = op1[1] / op2[1];
			a1.data = String(op1[1] - ((typeof divres === "number" ? Math.floor(divres) : divres) + Fleur.BigInt(divres >= 0 ? 0 : 1)) * op2[1]);
			a1.schemaTypeInfo = Fleur.numericTypes[Math.max(op1[0], op2[0])];
			Fleur.callback(function() {callback(a1);});
		});
	});
};