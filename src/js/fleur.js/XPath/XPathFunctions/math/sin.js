"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.math_sin_1 = {
  need_ctx: false,
  is_async: false,
  return_type: {type: Fleur.Type_double, occurence: "?"},
  params_type: [
    {type: Fleur.Type_double, occurence: "?"}
  ]
};
Fleur.Context.prototype.math_sin_1 = function() {
  if (this.item.isNotEmpty()) {
    const op  = Fleur.toJSValue(this.item, true, false, false, false, false, false);
    if (op[0] >= 0) {
      this.item.data = Fleur.Type_double.canonicalize(String(Math.sin(Number(op[1]))));
      this.item.schemaTypeInfo = Fleur.Type_double;
    }
  }
  return this;
};

Fleur.XPathFunctions_math["sin#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/math", "math:sin",
	function(arg) {
		if (arg === null) {
			return null;
		}
		return Math.sin(Number(arg));},
	null, [{type: Fleur.numericTypes, occurence: "?"}], false, false, {type: Fleur.Type_double, occurence: "?"});