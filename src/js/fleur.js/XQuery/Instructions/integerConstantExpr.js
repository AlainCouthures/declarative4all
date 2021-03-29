/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_integerConstantExpr = function(children, atomicType) {
  return this.inst("xqx_integerConstantExpr('" + children[0][1][0] + "')", false, atomicType !== Fleur.Type_integer && atomicType !== Fleur.atomicTypes ? atomicType : null);
};

Fleur.Context.prototype.xqx_integerConstantExpr = function(arg) {
  this.itemstack.push(this.item);
  const item = new Fleur.Text();
  item.appendData(Fleur.Type_integer.canonicalize(arg));
  item.schemaTypeInfo = Fleur.Type_integer;
  this.item = item;
  return this;
};

Fleur.XQueryEngine[Fleur.XQueryX.integerConstantExpr] = function(ctx, children, callback) {
	var a = new Fleur.Text();
	a.appendData(Fleur.Type_integer.canonicalize(children[0][1][0]));
	a.schemaTypeInfo = Fleur.Type_integer;
	Fleur.callback(function() {callback(a);});
};