"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.math_atan2_2 = function() {
  const arg2 = this.item;
  const arg1 = this.itemstack.pop();
  const op1 = Fleur.toJSValue(arg1, true, true, false, true, false, true);
  if (op1[0] < 0) {
    this.item = arg1;
    return this;
  }
  const op2 = Fleur.toJSValue(arg2, true, true, false, true, false, true);
  if (op2[0] < 0) {
    return this;
  }
  this.item.data = Fleur.Type_double.canonicalize(String(Math.atan2(Number(op1[1]), Number(op2[1]))));
  this.item.schemaTypeInfo = Fleur.Type_double;
  return this;
};

Fleur.XPathFunctions_math["atan2#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/math", "math:atan2", Fleur.Context.prototype.math_atan2_2,
  [Fleur.SequenceType_numeric_01, Fleur.SequenceType_numeric_01], Fleur.SequenceType_numeric_01);
/*
function(arg1, arg2) {
    return Math.atan2(Number(arg1), Number(arg2));},
  null, [{type: Fleur.numericTypes}, {type: Fleur.numericTypes}], false, false, {type: Fleur.Type_double, occurence: "?"});
*/