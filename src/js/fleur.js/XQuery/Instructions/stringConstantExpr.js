/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_stringConstantExpr = function(children, expectedType) {
  if (expectedType && Fleur.numericTypes.indexOf(expectedType.schemaTypeInfo) !== -1) {
    Fleur.XQueryError_xqt("FORG00001", null, "Wrong argument type");
  }
  return {
    inst: this.inst("xqx_stringConstantExpr('" + (children[0][1][0] || "").replace(/\'/g, "\\'") + "')").inst,
    sequenceType: {
      nodeType: Fleur.Node.TEXT_NODE,
      schemaTypeInfo: Fleur.Type_string,
      occurrence: 1
    }
  }
};

Fleur.Context.prototype.xqx_stringConstantExpr = function(arg) {
  this.itemstack.push(this.item);
  const item = new Fleur.Text();
  item.appendData(arg || "");
  item.schemaTypeInfo = Fleur.Type_string;
  this.item = item;
  return this;
};

Fleur.XQueryEngine[Fleur.XQueryX.stringConstantExpr] = function(ctx, children, callback) {
  var n = new Fleur.Text();
  n.appendData(children[0][1][0] || "");
  n.schemaTypeInfo = Fleur.Type_string;
  Fleur.callback(function() {callback(n);});
};