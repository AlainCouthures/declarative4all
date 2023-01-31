"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.math_log_1 = function() {
  if (this.item.isNotEmpty()) {
    const op  = Fleur.toJSValue(this.item, true, false, false, false, false, false);
    if (op[0] >= 0) {
      this.item.data = Fleur.Type_double.canonicalize(String(Math.log(Number(op[1]))));
      this.item.schemaTypeInfo = Fleur.Type_double;
    }
  }
  return this;
};

Fleur.XPathFunctions_math["log#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/math", "math:log", Fleur.Context.prototype.math_log_1,
  [Fleur.SequenceType_numeric_01], Fleur.SequenceType_numeric_01);
/*
function(arg) {
    if (arg === null) {
      return null;
    }
    return Math.log(Number(arg));},
  null, [{type: Fleur.numericTypes, occurence: "?"}], false, false, {type: Fleur.Type_double, occurence: "?"});
*/