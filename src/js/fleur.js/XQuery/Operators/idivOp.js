"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_idivOp = function(children) {
  const arg1 = this.gen(children[0][1][0], Fleur.SequenceType_numeric_1);
  const arg2 = this.gen(children[1][1][0], Fleur.SequenceType_numeric_1);
  if (arg1.value && arg2.value) {
    return this.staticargs([arg1, arg2]).xqx_idivOp().staticinst(this);
  }
  return this.inst("xqx_idivOp()", false, Fleur.SequenceType_integer_1, arg1.inst + arg2.inst);
};

Fleur.Context.prototype.xqx_idivOp = function() {
  const arg1 = this.itemstack.pop();
  const arg2 = this.item;
  const res = new Fleur.Text();
  const op1 = Fleur.toJSValue(arg1, true, false, false, false, false, true);
  if (op1[0] < 0) {
    this.item = arg1;
    return this;
  }
  const op2 = Fleur.toJSValue(arg2, true, false, false, true, false, true);
  if (op2[0] < 0) {
    return this;
  }
  const divres = typeof op1[1] === typeof op2[1] ? op1[1] / op2[1] : Number(op2[1]) / Number(op1[1]);
  res.data = String(typeof divres === "number" ? Math.floor(divres) + (divres >= 0 ? 0 : 1) : divres + Fleur.BigInt(divres >= 0 ? 0 : 1));
  res.schemaTypeInfo = Fleur.Type_integer;
  this.item = res;
  return this;
};
/*
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
*/
