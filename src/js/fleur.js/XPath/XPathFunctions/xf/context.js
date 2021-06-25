"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.xf_context_0 = {
  need_ctx: false,
  is_async: false,
  return_type: null,
  params_type: []
};
Fleur.Context.prototype.xf_context_0 = function() {
  this.itemstack.push(this.item);
  this.item = this.initialpath;
  return this;
};