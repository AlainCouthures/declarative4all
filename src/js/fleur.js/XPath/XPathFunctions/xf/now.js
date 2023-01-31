"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.xf_now_0 = function() {
  this.itemstack.push(this.item);
  const now = new Date();
  const jstz = now.getTimezoneOffset();
  this.item = new Fleur.Text();
  this.item.data = Fleur.dateToDateTime({d: now, tz: -jstz});
  this.item.schemaTypeInfo = Fleur.Type_dateTime;
  return this;
};

Fleur.XPathFunctions_xf["now#0"] = new Fleur.Function("http://www.w3.org/2002/xforms", "xf:now", Fleur.Context.prototype.xf_now_0,
  [], Fleur.SequenceType_dateTime_1, {dynonly: true});