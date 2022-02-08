"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.fn_true_0 = {
  need_ctx: false,
  is_async: false,
  return_type: {
    nodeType: Fleur.Node.TEXT_NODE,
    schemaTypeInfo: Fleur.Type_boolean,
    occurrence: "1"
  },
  params_type: []
};
Fleur.Context.prototype.fn_true_0 = function() {
  this.itemstack.push(this.item);
  const item = new Fleur.Text();
  item.appendData("true");
  item.schemaTypeInfo = Fleur.Type_boolean;
  this.item = item;
  return this;
};

Fleur.XPathFunctions_fn["true#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:true",
  function() {
    return true;
  },
  null, [], false, false, {type: Fleur.Type_boolean});