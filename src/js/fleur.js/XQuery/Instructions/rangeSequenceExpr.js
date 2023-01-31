"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_rangeSequenceExpr = function(children) {
  let r = this.gen(children[0][1][0], Fleur.SequenceType_integer_01).inst + this.gen(children[1][1][0], Fleur.SequenceType_integer_01).inst + this.inst("xqx_rangeSequenceExpr()").inst;
  return {
    inst: r,
    sequenceType: Fleur.SequenceType_integer_0n
  };
};

Fleur.Context.prototype.xqx_rangeSequenceExpr = function() {
  const arg1 = this.itemstack.pop();
  const arg2 = this.item;
  if (arg1.isEmpty()) {
    this.item = arg1;
    return this;
  }
  if (arg2.isEmpty()) {
    return this;
  }
  const op1 = Fleur.toJSNumber(arg1);
  if (op1[0] < 0) {
    this.item = arg1;
    return this;
  }
  const op2 = Fleur.toJSNumber(arg2);
  if (op2[0] < 0) {
    return this;
  }
  if (op1[1] !== op2[1]) {
    this.item = new Fleur.Sequence();
    while (op1[1] <= op2[1]) {
      const i = new Fleur.Text();
      i.schemaTypeInfo = Fleur.Type_integer;
      i.data = String(op1[1]);
      this.item.appendChild(i);
      op1[1]++;
    }
  }
  return this;
};

Fleur.XQueryEngine[Fleur.XQueryX.rangeSequenceExpr] = function(ctx, children, callback) {
  Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
    var op1;
    var a1 = Fleur.Atomize(n);
    if (a1 === Fleur.EmptySequence) {
      Fleur.callback(function() {callback(a1);});
      return;
    }
    op1 = Fleur.toJSNumber(a1);
    if (op1[0] !== 0 && (a1.schemaTypeInfo !== Fleur.Type_untypedAtomic || Math.floor(op1[1]) !== op1[1])) {
      Fleur.callback(function() {callback(Fleur.error(ctx, "XPTY0004"));});
      return;
    }
    Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
      var op2;
      var a2 = Fleur.Atomize(n);
      if (a2 === Fleur.EmptySequence) {
        Fleur.callback(function() {callback(a2);});
        return;
      }
      op2 = Fleur.toJSNumber(a2);
      if (op2[0] !== 0 && (a2.schemaTypeInfo !== Fleur.Type_untypedAtomic || Math.floor(op2[1]) !== op2[1])) {
        Fleur.callback(function() {callback(Fleur.error(ctx, "XPTY0004"));});
        return;
      }
      if (op1[1] > op2[1]) {
        Fleur.callback(function() {callback(Fleur.EmptySequence);});
        return;
      }
      if (op1[1] === op2[1]) {
        a2.schemaTypeInfo = Fleur.Type_integer;
        Fleur.callback(function() {callback(a2);});
        return;
      }
      var result = new Fleur.Sequence();
      result.nodeType = Fleur.Node.SEQUENCE_NODE;
      while (op1[1] <= op2[1]) {
        var i = new Fleur.Text();
        i.schemaTypeInfo = Fleur.Type_integer;
        i.data = String(op1[1]);
        result.appendChild(i);
        op1[1]++;
      }
      Fleur.callback(function() {callback(result);});
    });
  });
};