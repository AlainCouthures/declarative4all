/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.fn_floor_1 = {
  need_ctx: false,
  is_async: false,
  return_type: {type: Fleur.Type_double, occurence: "?"},
  params_type: [
    {type: Fleur.Type_double, occurence: "?"}
  ]
};
Fleur.Context.prototype.fn_floor_1 = function() {
  if (this.item.isNotEmpty()) {
    const op  = Fleur.toJSValue(this.item, true, false, false, false, false, false);
    if (op[0] >= 0) {
      this.item.data = String(Math.floor(Number(op[1])));
      this.item.schemaTypeInfo = Fleur.Type_double;
    }
  }
  return this;
};

Fleur.XPathFunctions_fn["floor#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:floor",
	function(a) {
		return a ? [typeof a[0] === "bigint" ? a[0] : Math.floor(a[0]), a[1]] : null;
	},
	null, [{type: Fleur.numericTypes, adaptative: true, occurence: "?"}], false, false, {type: Fleur.numericTypes, adaptative: true, occurence: "?"});