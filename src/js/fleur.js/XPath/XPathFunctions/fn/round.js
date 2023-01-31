"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_round_1 = function() {
  if (this.item.isNotEmpty()) {
    const a = Number(this.item.data);
    const res = new Fleur.Text();
    res.data = String(Math.round(a));
    res.schemaTypeInfo = this.item.schemaTypeInfo;
    this.item = res;
  }
  return this;
};
Fleur.Context.prototype.fn_round_2 = function() {
  const arg = this.itemstack.pop();
  if (arg.isNotEmpty()) {
    const precision = Number(this.item.data);
    const res = new Fleur.Text();
    res.schemaTypeInfo = arg.schemaTypeInfo;
    const a = Number(arg.data);
    res.data = String(Math.round(a * Math.pow(10, precision) + Math.pow(10, Math.floor(Math.log(Math.abs(a)) * Math.LOG10E) + precision - 15)) / Math.pow(10, precision));
    this.item = res;
  } else {
    this.item = arg;
  }
  return this;
};

Fleur.XPathFunctions_fn["round#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:round", Fleur.Context.prototype.fn_round_1,
  [Fleur.SequenceType_numeric_01], Fleur.SequenceType_numeric_01);

Fleur.XPathFunctions_fn["round#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:round", Fleur.Context.prototype.fn_round_2,
  [Fleur.SequenceType_numeric_01, Fleur.SequenceType_integer_1], Fleur.SequenceType_numeric_01);
/*
function(arg) {
    if (arg === null) {
      return [null, null];
    }
    var a = arg[0];
    var t = arg[1];
    var a2, t2;
    a2 = Math.round(a);
    t2 = t;
    return [a2, t2];
  },
  null, [{type: Fleur.numericTypes, adaptative: true, occurence: "?"}], false, false, {type: Fleur.numericTypes, adaptative: true, occurence: "?"});
*/
/*
  function(arg, precision) {
    if (arg === null) {
      return [null, null];
    }
    var a = arg[0];
    var t = arg[1];
    var a2, t2;
    a2 = Math.round(a * Math.pow(10, precision) + Math.pow(10, Math.floor(Math.log(Math.abs(a)) * Math.LOG10E) + precision - 15)) / Math.pow(10, precision);
    t2 = t;
    return [a2, t2];
  },
  null, [{type: Fleur.numericTypes, adaptative: true, occurence: "?"}, {type: Fleur.Type_integer}], false, false, {type: Fleur.numericTypes, adaptative: true, occurence: "?"});
*/