/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_decimalConstantExpr = function(children) {
	return this.inst("xqx_decimalConstantExpr('" + children[0][1][0] + "')");
};

Fleur.Context.prototype.xqx_decimalConstantExpr = function(arg) {
  this.itemstack.push(this.item);
  const item = new Fleur.Text();
  item.appendData(Fleur.Type_decimal.canonicalize(arg));
	item.schemaTypeInfo = Fleur.Type_decimal;
  this.item = item;
  return this;
};

Fleur.XQueryEngine[Fleur.XQueryX.decimalConstantExpr] = function(ctx, children, callback) {
	var a = new Fleur.Text();
	a.appendData(Fleur.Type_decimal.canonicalize(children[0][1][0]));
	a.schemaTypeInfo = Fleur.Type_decimal;
	Fleur.callback(function() {callback(a);});
};