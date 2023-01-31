"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_sum_1 = function() {
  if (this.item.nodeType === Fleur.Node.SEQUENCE_NODE) {
    if (this.item.childNodes.length !== 0) {
      const res = new Fleur.Text();
      res.data = Fleur.Type_integer.canonicalize(String(this.item.data.length));
      res.schemaTypeInfo = Fleur.Type_integer;
      this.item = res;
    } else {
      this.item = new Fleur.Text();
      this.item.data = "0";
      this.item.schemaTypeInfo = Fleur.Type_integer;
    }
  }
  return this;
};
Fleur.Context.prototype.fn_sum_2 = function() {
  this.notyet();
};

Fleur.XPathFunctions_fn["sum#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:sum", Fleur.Context.prototype.fn_sum_1,
  [Fleur.SequenceType_anyAtomicType_0n], Fleur.SequenceType_anyAtomicType_1);

Fleur.XPathFunctions_fn["sum#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:sum", Fleur.Context.prototype.fn_sum_2,
  [Fleur.SequenceType_anyAtomicType_0n, Fleur.SequenceType_anyAtomicType_01], Fleur.SequenceType_anyAtomicType_1);
/*
  function(arg) {
    if (arg === null) {
      return [null, null];
    }
    if (arg[0] instanceof Array) {
      var r = arg.reduce(function(p, c) {
        var rt;
        if (c[1] === Fleur.Type_untypedAtomic) {
          c[1] = Fleur.Type_double;
        }
        if (p[1]) {
          rt = p[1].compareType(c[1], Fleur.TypeInfo.DERIVATION_RESTRICTION);
          if (!rt) {
            if (p[1].isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION) || c[1].isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
              if (p[1].isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION) || c[1].isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
                rt = Fleur.Type_double;
              } else {
                rt = Fleur.Type_float;
              }
            } else {
              rt = Fleur.Type_double;
            }
          }
        } else {
          rt = c[1];
        }
        var val = typeof p[0] === typeof c[0] ? p[0] + c[0] : Number(p[0]) + Number(c[0]);
        var precision = p[2] !== undefined && c[2] !== undefined ? Math.max(p[2], c[2]) : undefined;
        if (rt === Fleur.Type_decimal) {
          val = Math.round(val * Math.pow(10, precision)) / Math.pow(10, precision);
        }
        return [val, rt, precision];
      }, [0, null, 0]);
      return r;
      /
      var v = r[0];
      var t = r[1];
      var p = r[2];
      if (t.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
        if (v !== Math.floor(v)) {
          t = Fleur.Type_decimal;
        }
      }
      return [v, t, p];
      /
    }
    if (arg[1] === Fleur.Type_untypedAtomic) {
      arg[1] = Fleur.Type_double;
    }
    return arg;
  },
  null, [{type: Fleur.numericTypes, adaptative: true, occurence: "*"}], false, false, {type: Fleur.numericTypes, adaptative: true, occurence: "?"});
*/