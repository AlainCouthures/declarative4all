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
  return_type: {
    nodeType: Fleur.Node.TEXT_NODE,
    schemaTypeInfo: Fleur.Type_dateTime,
    occurrence: "1"
  },
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