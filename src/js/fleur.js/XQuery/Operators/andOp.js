"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_andOp = function(children) {
  const arg1 = this.gen(children[0][1][0]);
  const arg2 = this.gen(children[1][1][0]);
  if (arg1.value) {
    const arg1boolvalue = this.staticargs([arg1]).fn_boolean_1();
    if (arg1boolvalue.item.data === "false") {
      return {
        inst: this.inst("xqx_constantExpr(Fleur.Type_boolean, 'false')", false).inst,
        sequenceType: Fleur.SequenceType_boolean_1,
        value: arg1boolvalue.item
      };
    }
    if (arg2.value) {
      const arg2boolvalue = this.staticargs([arg2]).fn_boolean_1();
      return {
        inst: this.inst("xqx_constantExpr(Fleur.Type_boolean, '" + arg2boolvalue.item.data + "')", false).inst,
        sequenceType: Fleur.SequenceType_boolean_1,
        value: arg2boolvalue.item
      };
    }
    let result = arg2.inst;
    result += this.inst("fn_boolean_1()").inst;
    return {
      inst: result,
      sequenceType: Fleur.SequenceType_boolean_1
    };
  }
  let result = arg1.inst + "\n" + this.indent + "if (" + this.ctxvarname + ".fn_boolean_1().dropTrue()) {";
  const previndent = this.indent;
  this.indent += this.step;
  result += arg2.inst;
  result += this.inst("fn_boolean_1()").inst;
  this.indent = previndent;
  return {
    inst: result + "\n" + previndent + "}",
    sequenceType: Fleur.SequenceType_boolean_1
  };
};
/*
Fleur.XQueryEngine[Fleur.XQueryX.andOp] = function(ctx, children, callback) {
  var op1;
  Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
    var a1 = Fleur.Atomize(n);
    op1 = Fleur.toJSBoolean(a1);
    if (op1[0] < 0) {
      Fleur.callback(function() {callback(n);});
      return;
    }
    if (!op1[1]) {
      a1.data = "false";
      a1.schemaTypeInfo = Fleur.Type_boolean;
      Fleur.callback(function() {callback(a1);});
    } else {
      Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
        var op2;
        var a2 = Fleur.Atomize(n);
        op2 = Fleur.toJSBoolean(a2);
        if (op2[0] < 0) {
          Fleur.callback(function() {callback(n);});
          return;
        }
        a2.data = String(op2[1]);
        a2.schemaTypeInfo = Fleur.Type_boolean;
        Fleur.callback(function() {callback(a2);});
      });
    }
  });
};
*/