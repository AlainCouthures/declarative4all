/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_doubleConstantExpr = function(children) {
	return this.inst("xqx_doubleConstantExpr('" + children[0][1][0] + "')");
};

Fleur.Context.prototype.xqx_doubleConstantExpr = function(arg) {
  this.itemstack.push(this.item);
  const item = new Fleur.Text();
  item.appendData(Fleur.Type_double.canonicalize(arg));
	item.schemaTypeInfo = Fleur.Type_double;
  this.item = item;
  return this;
};

Fleur.XQueryEngine[Fleur.XQueryX.doubleConstantExpr] = function(ctx, children, callback) {
	var a = new Fleur.Text();
	a.appendData(Fleur.Type_double.canonicalize(children[0][1][0]));
	a.schemaTypeInfo = Fleur.Type_double;
	Fleur.callback(function() {callback(a);});
};