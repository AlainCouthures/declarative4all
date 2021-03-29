"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.xf_js$_eval_1 = {
  need_ctx: false,
  is_async: false,
  return_type: {type: Fleur.Type_string},
  params_type: [
    {type: Fleur.Type_string}
  ]
};
Fleur.Context.prototype.xf_js$_eval_1 = function() {
  this.item.data = String((0, eval)(this.item.data));
  return this;
};