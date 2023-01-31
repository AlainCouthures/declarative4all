"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.xqx_constantExpr = function(argType, arg) {
  this.itemstack.push(this.item);
  const item = new Fleur.Text();
  item.appendData(arg);
  item.schemaTypeInfo = argType;
  this.item = item;
  return this;
};