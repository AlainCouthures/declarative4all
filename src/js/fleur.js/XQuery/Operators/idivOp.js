"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_idivOp = function(children) {
  const arg1 = this.gen(children[0][1][0], {
    nodeType: Fleur.Node.TEXT_NODE,
    schemaTypeInfo: Fleur.Type_numeric,
    occurrence: "?"
  });
  if (!arg1.sequenceType.schemaTypeInfo.as(Fleur.Type_numeric)) {
    Fleur.XQueryError_xqt("XPST0017", null, "Not a number");
  }
  const arg2 = this.gen(children[1][1][0], {
    nodeType: Fleur.Node.TEXT_NODE,
    schemaTypeInfo: Fleur.Type_numeric,
    occurrence: "?"
  });
  if (!arg2.sequenceType.schemaTypeInfo.as(Fleur.Type_numeric)) {
    Fleur.XQueryError_xqt("XPST0017", null, "Not a number");
  }
  return this.inst("xqx_idivOp()", false, {
    nodeType: Fleur.Node.TEXT_NODE,
    schemaTypeInfo: Fleur.Type_integer,
    occurrence: "?"
  }, arg1.inst + arg2.inst);
};

Fleur.Context.prototype.xqx_idivOp = function() {
  const arg1 = this.itemstack.pop();
  const arg2 = this.item;
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
  this.item.data = String(typeof divres === "number" ? Math.floor(divres) + (divres >= 0 ? 0 : 1) : divres + Fleur.BigInt(divres >= 0 ? 0 : 1));
  this.item.schemaTypeInfo = Fleur.Type_integer;
  return this;
};

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
