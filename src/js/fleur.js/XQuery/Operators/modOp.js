"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_modOp = function(children) {
  const arg1 = this.gen(children[0][1][0], Fleur.SequenceType_numeric_1);
  const arg2 = this.gen(children[1][1][0], Fleur.SequenceType_numeric_1);
  if (arg1.value && arg2.value) {
    return this.staticargs([arg1, arg2]).xqx_modOp().staticinst(this);
  }
  return this.inst("xqx_modOp()", false, Fleur.SequenceType_numeric_1, arg1.inst + arg2.inst);
};

Fleur.Context.prototype.xqx_modOp = function() {
  const arg1 = this.itemstack.pop();
  const arg2 = this.item;
  const op1 = Fleur.toJSNumber(arg1);
  if (op1[0] < 0) {
    Fleur.XQueryError_xqt(arg1.nodeType === Fleur.Node.ELEMENT_NODE || arg2.nodeType === Fleur.Node.ELEMENT_NODE ? "FORG0001" : "XPTY0004");
  }
  const op2 = Fleur.toJSNumber(arg2);
  if (op2[0] < 0) {
    Fleur.XQueryError_xqt(arg1.nodeType === Fleur.Node.ELEMENT_NODE || arg2.nodeType === Fleur.Node.ELEMENT_NODE ? "FORG0001" : "XPTY0004");
  }
  if (typeof op1[1] !== typeof op2[1]) {
    op1[1] = Number(op1[1]);
    op2[1] = Number(op2[1]);
  }
  const divres = op1[1] / op2[1];
  const res = new Fleur.Text();
  res.data = String(op1[1] - ((typeof divres === "number" ? Math.floor(divres) + (divres >= 0 ? 0 : 1) : divres + Fleur.BigInt(divres >= 0 ? 0 : 1))) * op2[1]);
  res.schemaTypeInfo = Fleur.numericTypes[Math.max(op1[0], op2[0])];
  this.item = res;
  return this;
};
/*
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
*/