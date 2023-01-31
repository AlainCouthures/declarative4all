"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_round$_half$_to$_even_1 = function() {
  if (this.item.isNotEmpty()) {
    let a = Number(this.item.data);
    if (a - Math.floor(a) === 0.5 && Math.floor(a) % 2 === 0) {
      a -= 1;
    }
    const res = new Fleur.Text();
    res.data = String(Math.round(a));
    res.schemaTypeInfo = this.item.schemaTypeInfo;
    this.item = res;
  }
  return this;
};
Fleur.Context.prototype.fn_round$_half$_to$_even_2 = function() {
  const precision = Number(this.item.data);
  const arg = this.itemstack.pop();
  if (arg.isNotEmpty()) {
    const res = new Fleur.Text();
    let a = Number(arg.data);
    let a2 = a * Math.pow(10, precision) + Math.pow(10, Math.floor(Math.log(Math.abs(a)) * Math.LOG10E) + precision - 15);
    if (a2 === Number.POSITIVE_INFINITY) {
      res.data = "+INF";
    } else if (a2 === 0) {
      res.data = "0";
    } else if (Math.round(a2 * 2) / 2  - Math.floor(a2) === 0.5 && Math.floor(a2) % 2 === 0) {
      a2 -= 1;
      res.data = String(Math.round(a2) * Math.pow(10, -precision));
    } else {
      res.data = String(Math.round(a2) * Math.pow(10, -precision));
    }
    res.schemaTypeInfo = arg.schemaTypeInfo;
    this.item = res;
  } else {
    this.item = arg;
  }
  return this;
};

Fleur.XPathFunctions_fn["round-half-to-even#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:round-half-to-even", Fleur.Context.prototype.fn_round$_half$_to$_even_1,
  [Fleur.SequenceType_numeric_01], Fleur.SequenceType_numeric_01);

Fleur.XPathFunctions_fn["round-half-to-even#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:round-half-to-even", Fleur.Context.prototype.fn_round$_half$_to$_even_2,
  [Fleur.SequenceType_numeric_01, Fleur.SequenceType_integer_1], Fleur.SequenceType_numeric_01);
/*
  function(arg) {
    if (arg === null) {
      return [null, null];
    }
    var a = arg[0];
    var t = arg[1];
    var a2, t2;
    if (a - Math.floor(a) === 0.5 && Math.floor(a) % 2 === 0) {
      a -= 1;
    }
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
    var a2;
    a2 = a * Math.pow(10, precision) + Math.pow(10, Math.floor(Math.log(Math.abs(a)) * Math.LOG10E) + precision - 15);
    if (a2 === Number.POSITIVE_INFINITY) {
      return [a, t];
    }
    if (a2 === 0) {
      return [0, t];
    }
    if (Math.round(a2 * 2) / 2  - Math.floor(a2) === 0.5 && Math.floor(a2) % 2 === 0) {
      a2 -= 1;
    }
    return [Math.round(a2) * Math.pow(10, -precision), t];
  },
  null, [{type: Fleur.numericTypes, adaptative: true, occurence: "?"}, {type: Fleur.Type_integer}], false, false, {type: Fleur.numericTypes, adaptative: true, occurence: "?"});
*/