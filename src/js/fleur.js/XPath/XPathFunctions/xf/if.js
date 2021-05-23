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
    {type: Fleur.Node},
    {type: Fleur.Node},
    {type: Fleur.Node}
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