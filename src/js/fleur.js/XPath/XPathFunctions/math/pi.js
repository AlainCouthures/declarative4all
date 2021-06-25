"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.math_pi_0 = {
  need_ctx: false,
  is_async: false,
  return_type: {
    nodeType: Fleur.Node.TEXT_NODE,
    schemaTypeInfo: Fleur.Type_numeric,
    occurrence: "?"
  },
  params_type: []
};
Fleur.Context.prototype.math_pi_0 = function() {
  this.itemstack.push(this.item);
	const item = new Fleur.Text();
	item.data = "3.141592653589793";
	item.schemaTypeInfo = Fleur.Type_double;
  this.item = item;
  return this;
};

Fleur.XPathFunctions_math["pi#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/math", "math:pi",
	function() { return 3.141592653589793; },
	null, [], false, false, {type: Fleur.Type_double});