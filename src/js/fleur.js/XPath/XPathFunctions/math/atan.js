"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.math_atan_1 = {
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
    }
  ]
};
Fleur.Context.prototype.math_atan_1 = function() {
  if (this.item.isNotEmpty()) {
    const op  = Fleur.toJSValue(this.item, true, false, false, false, false, false);
    if (op[0] >= 0) {
      this.item.data = Fleur.Type_double.canonicalize(String(Math.atan(Number(op[1]))));
      this.item.schemaTypeInfo = Fleur.Type_double;
    }
  }
  return this;
};

Fleur.XPathFunctions_math["atan#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/math", "math:atan",
	function(arg) {
		if (arg === null) {
			return null;
		}
		return Math.atan(Number(arg));},
	null, [{type: Fleur.numericTypes, occurence: "?"}], false, false, {type: Fleur.Type_double, occurence: "?"});