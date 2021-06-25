"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.xf_if_3 = {
  need_ctx: false,
  is_async: false,
  return_type: null,
  params_type: [
    {
      nodeType: Fleur.Node.TEXT_NODE,
      schemaTypeInfo: Fleur.Type_boolean,
      occurrence: "1"
    },
    null,
    null
  ]
};
Fleur.Context.prototype.xf_if_3 = function() {
  let arg3 = this.item;
  let arg2 = this.itemstack.pop();
  this.item = this.itemstack.pop()
  this.fn_boolean_1();
  this.item = this.item.data === "true" ? arg2 : arg3;
  return this;
};