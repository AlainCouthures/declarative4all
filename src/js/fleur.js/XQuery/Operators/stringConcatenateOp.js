"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_stringConcatenateOp = function(children) {
  const arg1 = this.gen(children[0][1][0], Fleur.SequenceType_string_01);
  const arg2 = this.gen(children[1][1][0], Fleur.SequenceType_string_01);
  if (arg1.value && arg2.value) {
    return this.staticargs([arg1, arg2]).xqx_stringConcatenateOp().staticinst(this);
  }
  return this.inst("xqx_stringConcatenateOp()", false, Fleur.SequenceType_string_01, arg1.inst + arg2.inst);
};

Fleur.Context.prototype.xqx_stringConcatenateOp = function() {
  let arg1 = this.itemstack.pop();
  const arg2 = this.item;
  const res = new Fleur.Text();
  res.data = arg1.data + arg2.data;
  res.schemaTypeInfo = Fleur.Type_string;
  this.item = res;
  return this;
};
/*
Fleur.XQueryEngine[Fleur.XQueryX.stringConcatenateOp] = function(ctx, children, callback) {
  Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
    var a1 = Fleur.Atomize(n, true);
    if (a1.schemaTypeInfo === Fleur.Type_error) {
      Fleur.callback(function() {callback(a1);});
      return;
    }
    if (a1 === Fleur.EmptySequence) {
      a1 = new Fleur.Text();
      a1.data = "";
    }
    Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
      var a2 = Fleur.Atomize(n, true);
      if (a2.schemaTypeInfo === Fleur.Type_error) {
        Fleur.callback(function() {callback(a2);});
        return;
      }
      if (a2.data) {
        a1.data += a2.data;
      }
      a1.schemaTypeInfo = Fleur.Type_string;
      Fleur.callback(function() {callback(a1);});
    });
  });
};
*/