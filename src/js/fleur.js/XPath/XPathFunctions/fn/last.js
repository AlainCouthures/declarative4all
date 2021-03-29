"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.fn_last_0 = {
  need_ctx: false,
  is_async: false,
  return_type: {type: Fleur.Type_integer},
  params_type: []
};
Fleur.Context.prototype.fn_last_0 = function() {
  this.itemstack.push(this.item);
	const item = new Fleur.Text();
	item.data = String(this.last);
	item.schemaTypeInfo = Fleur.Type_integer;
  this.item = item;
  return this;
};

Fleur.XPathFunctions_fn["last#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:last",
	function(ctx) {
		return ctx._last;
	},
	null, [], true, false, {type: Fleur.Type_integer});