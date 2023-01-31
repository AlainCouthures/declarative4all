"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_contextItemExpr = function(children, expectedSequenceType) {
  return this.inst("xqx_contextItemExpr()", false, expectedSequenceType, "", expectedSequenceType);
};

Fleur.Context.prototype.xqx_contextItemExpr = function() {
  this.itemstack.push(this.item);
  this.item = this.path;
  return this;
};

Fleur.XQueryEngine[Fleur.XQueryX.contextItemExpr] = function(ctx, children, callback) {
  Fleur.callback(function() {callback(ctx._curr);});
};