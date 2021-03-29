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
  return_type: {type: Fleur.Node},
  params_type: [
    {type: Fleur.Type_boolean},
    {type: Fleur.Node},
    {type: Fleur.Node}
  ]
};
Fleur.Context.prototype.xf_if_3 = function() {
  let arg2 = this.itemstack.pop();
  let arg1 = this.itemstack.pop();
  if (arg1.data === "true") {
    this.item = arg2;
  }
  return this;
};