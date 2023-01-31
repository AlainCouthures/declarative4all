"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_ceiling_1 = function() {
  if (this.item.isNotEmpty()) {
    const res = new Fleur.Text();
    const op  = Fleur.toJSValue(this.item, true, false, false, false, false, false);
    if (op[0] >= 0) {
      res.data = String(Math.ceil(Number(op[1])));
      res.schemaTypeInfo = Fleur.Type_double;
    }
    this.item = res;
  }
  return this;
};

Fleur.XPathFunctions_fn["ceiling#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:ceiling", Fleur.Context.prototype.fn_ceiling_1,
  [Fleur.SequenceType_numeric_01], Fleur.SequenceType_numeric_01);
/*
  function(a) {
    return a ? [typeof a[0] === "bigint" ? a[0] : Math.ceil(a[0]), a[1]] : null;
  },
  null, [{type: Fleur.numericTypes, adaptative: true, occurence: "?"}], false, false, {type: Fleur.numericTypes, adaptative: true, occurence: "?"});
*/