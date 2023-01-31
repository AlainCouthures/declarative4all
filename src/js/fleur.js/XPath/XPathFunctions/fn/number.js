"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_number_0 = function() {
  return this.current().fn_number_1();
};
Fleur.Context.prototype.fn_number_1 = function() {
  const res = new Fleur.Text();
  if (this.item.isNotEmpty()) {
    try {
      res.data = Fleur.Type_double.canonicalize(this.item.data);
    } catch(e) {
      res.data = "NaN";
    }
  } else {
    res.data = "NaN";
  }
  res.schemaTypeInfo = Fleur.Type_double;
  this.item = res;
  return this;
};

Fleur.XPathFunctions_fn["number#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:number", Fleur.Context.prototype.fn_number_0,
  [], Fleur.SequenceType_numeric_1);

Fleur.XPathFunctions_fn["number#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:number", Fleur.Context.prototype.fn_number_1,
  [Fleur.SequenceType_anyAtomicType_01], Fleur.SequenceType_numeric_1);
/*
  function(ctx) {
    return Fleur.XPathFunctions_fn["number#1"].jsfunc(ctx._curr);
  },
  null, [], true, false, {type: Fleur.Type_double});
*/
/*
  function(arg) {
    var a = Fleur.Atomize(arg);
    if (a.schemaTypeInfo === Fleur.Type_error) {
      return a;
    }
    if (a === Fleur.EmptySequence || a.data === "NaN") {
      return NaN;
    }
    if (a.schemaTypeInfo === Fleur.Type_boolean) {
      return a.data === "true" ? 1.0e0 : 0.0e0;
    }
    if (!(a.schemaTypeInfo !== Fleur.Type_anyURI && /^\s*(([\-+]?([0-9]+(\.[0-9]*)?)|(\.[0-9]+))([eE][-+]?[0-9]+)?|-?INF|NaN)\s*$/.test(a.data))) {
      return NaN;
    }
    if (a.data === "INF") {
      return Number.POSITIVE_INFINITY
    }
    if (a.data === "-INF") {
      return Number.NEGATIVE_INFINITY
    }
    return parseFloat(a.data);
  },
  null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_double});
*/