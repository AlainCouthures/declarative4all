"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
 Fleur.signatures.fn_number_1 = {
  need_ctx: false,
  is_async: false,
  return_type: {
    nodeType: Fleur.Node.TEXT_NODE,
    schemaTypeInfo: Fleur.Type_numeric,
    occurrence: "1"
  },
  params_type: [
    {
      nodeType: Fleur.Node.TEXT_NODE,
      schemaTypeInfo: Fleur.Type_anyAtomicType,
      occurrence: "?"
    }
  ]
};
Fleur.Context.prototype.fn_number_1 = function() {
  if (this.item.isNotEmpty()) {
    try {
      this.item.data = Fleur.Type_double.canonicalize(this.item.data);
    } catch {
      this.item.data = "NaN";
    }
  } else {
    this.item = new Fleur.Text();
    this.item.data = "NaN";
  }
  this.item.schemaTypeInfo = Fleur.Type_double;
  return this;
};

Fleur.XPathFunctions_fn["number#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:number",
  function(ctx) {
    return Fleur.XPathFunctions_fn["number#1"].jsfunc(ctx._curr);
  },
  null, [], true, false, {type: Fleur.Type_double});

Fleur.XPathFunctions_fn["number#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:number",
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