"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.xf_choose_3 = function() {
  let arg3 = this.item;
  let arg2 = this.itemstack.pop();
  this.item = this.itemstack.pop();
  this.fn_boolean_1();
  this.item = this.item.data === "true" ? arg2 : arg3;
  return this;
};
Fleur.XPathFunctions_xf["choose#3"] = new Fleur.Function("http://www.w3.org/2002/xforms", "xf:choose", Fleur.Context.prototype.xf_choose_3,
  [Fleur.SequenceType_boolean_1, Fleur.SequenceType_item_0n, Fleur.SequenceType_item_0n], Fleur.SequenceType_item_0n);