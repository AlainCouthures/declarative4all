/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.fn_false_0 = {
  need_ctx: false,
  is_async: false,
  return_type: {type: Fleur.Type_boolean},
  params_type: []
};
Fleur.Context.prototype.fn_false_0 = function() {
  this.itemstack.push(this.item);
	const item = new Fleur.Text();
	item.appendData("false");
	item.schemaTypeInfo = Fleur.Type_boolean;
  this.item = item;
  return this;
};

Fleur.XPathFunctions_fn["false#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:false",
	function() {
		return false;
	},
	null, [], false, false, {type: Fleur.Type_boolean});