"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_doubleConstantExpr = function(children, expectedSequenceType) {
  const issubtype = expectedSequenceType && expectedSequenceType.schemaTypeInfo !== Fleur.Type_double && expectedSequenceType.schemaTypeInfo.as(Fleur.Type_double);
  const subtype = issubtype ? expectedSequenceType.schemaTypeInfo : Fleur.Type_double;
  const item = new Fleur.Text();
  item.schemaTypeInfo = subtype;
  try {
    const canon = subtype.canonicalize(children[0][1][0]);
    item.appendData(canon);
    return {
      inst: this.inst((issubtype ? "xqx_constantExpr(Fleur.Type_" + expectedSequenceType.schemaTypeInfo.typeName + ", '" : "xqx_doubleConstantExpr('") + canon + "')", false).inst,
      sequenceType: new Fleur.SequenceType(Fleur.Node.TEXT_NODE, subtype, "1"),
      value: item
    };
  } catch (e) {
    item.appendData(children[0][1][0]);
    Fleur.XQueryError_xqt(e.code === Fleur.DOMException.VALIDATION_ERR ? "FORG0001" : "FODT0001", null, "Wrong argument for implicit xs:" + expectedSequenceType.schemaTypeInfo.typeName + "#1", "", item);
  }
};

Fleur.Context.prototype.xqx_doubleConstantExpr = function(arg) {
  this.itemstack.push(this.item);
  const item = new Fleur.Text();
  item.appendData(Fleur.Type_double.canonicalize(arg));
  item.schemaTypeInfo = Fleur.Type_double;
  this.item = item;
  return this;
};
/*
Fleur.XQueryEngine[Fleur.XQueryX.doubleConstantExpr] = function(ctx, children, callback) {
  var a = new Fleur.Text();
  a.appendData(Fleur.Type_double.canonicalize(children[0][1][0]));
  a.schemaTypeInfo = Fleur.Type_double;
  Fleur.callback(function() {callback(a);});
};
*/