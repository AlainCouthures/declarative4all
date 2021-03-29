"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.xf_now_0 = {
  need_ctx: false,
  is_async: false,
  return_type: {type: Fleur.Type_dateTime},
  params_type: []
};
Fleur.Context.prototype.xf_now_0 = function() {
  this.itemstack.push(this.item);
  const now = new Date();
  const jstz = now.getTimezoneOffset();
  this.item = new Fleur.Text();
  this.item.data = Fleur.dateToDateTime({d: now, tz: -jstz});
  this.item.schemaTypeInfo = Fleur.Type_dateTime;
  return this;
};