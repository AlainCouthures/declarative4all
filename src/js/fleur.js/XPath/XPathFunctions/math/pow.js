"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.math_pow_2 = {
  need_ctx: false,
  is_async: false,
  return_type: {
    nodeType: Fleur.Node.TEXT_NODE,
    schemaTypeInfo: Fleur.Type_numeric,
    occurrence: "?"
  },
  params_type: [
    {
      nodeType: Fleur.Node.TEXT_NODE,
      schemaTypeInfo: Fleur.Type_numeric,
      occurrence: "?"
    },
    {
      nodeType: Fleur.Node.TEXT_NODE,
      schemaTypeInfo: Fleur.Type_numeric,
      occurrence: "?"
    }
  ]
};
Fleur.Context.prototype.math_pow_2 = function() {
  const arg1 = this.itemstack.pop();
  const arg2 = this.item;
  const op1 = Fleur.toJSValue(arg1, true, true, false, true, false, true);
  if (op1[0] < 0) {
    this.item = arg1;
    return this;
  }
  const op2 = Fleur.toJSValue(arg2, true, true, false, true, false, true);
  if (op2[0] < 0) {
    return this;
  }
	this.item.data = Fleur.Type_double.canonicalize(String(Math.pow(Number(op1[1]), Number(op2[1]))));
	this.item.schemaTypeInfo = Fleur.Type_double;
  return this;
};

Fleur.XPathFunctions_math["pow#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/math", "math:pow",
	function(x, y) {
		if (x === null) {
			return null;
		}
		return y >= 0 && typeof x === "bigint" && typeof y === "bigint" ? eval("x ** y") : Math.pow(Number(x), Number(y));},
	null, [{type: Fleur.numericTypes, occurence: "?"}, {type: Fleur.numericTypes}], false, false, {type: Fleur.Type_double, occurence: "?"});