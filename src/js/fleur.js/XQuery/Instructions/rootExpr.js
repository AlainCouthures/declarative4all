/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_rootExpr = function() {
  return this.inst("xqx_rootExpr()");
};
Fleur.Context.prototype.xqx_rootExpr = function() {
  this.item = this.path.ownerDocument || this.path;
  return this;
};

Fleur.XQueryEngine[Fleur.XQueryX.rootExpr] = function(ctx, children, callback) {
  Fleur.callback(function() {callback(ctx._curr.ownerDocument || ctx._curr);});
};