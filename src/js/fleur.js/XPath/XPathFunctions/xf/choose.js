"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.xf_choose_3 = {
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
Fleur.Context.prototype.xf_choose_3 = function() {
  let arg2 = this.itemstack.pop();
  let arg1 = this.itemstack.pop();
  if (arg1.data === "true") {
    this.item = arg2;
  }
  return this;
};