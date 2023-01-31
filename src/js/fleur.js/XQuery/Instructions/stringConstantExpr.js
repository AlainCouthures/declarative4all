"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_stringConstantExpr = function(children, expectedSequenceType) {
  const issubtype = expectedSequenceType && expectedSequenceType.schemaTypeInfo !== Fleur.Type_string && expectedSequenceType.schemaTypeInfo.as(Fleur.Type_string);
  const subtype = issubtype ? expectedSequenceType.schemaTypeInfo : Fleur.Type_string;
  const item = new Fleur.Text();
  item.schemaTypeInfo = subtype;
  try {
    const canon = subtype.canonicalize(children[0][1][0] || "");
    item.appendData(canon);
    return {
      inst: this.inst((issubtype ? "xqx_constantExpr(Fleur.Type_" + expectedSequenceType.schemaTypeInfo.typeName + ", '" : "xqx_stringConstantExpr('") + canon.replace(/\'/g, "\\'") .replace(/\n/g, "\\n") + "')", false).inst,
      sequenceType: new Fleur.SequenceType(Fleur.Node.TEXT_NODE, subtype, "1"),
      value: item
    };
  } catch (e) {
    item.appendData(children[0][1][0] || "");
    Fleur.XQueryError_xqt(e.code === Fleur.DOMException.VALIDATION_ERR ? "FORG0001" : "FODT0001", null, "Wrong argument for implicit xs:" + expectedSequenceType.schemaTypeInfo.typeName + "#1", "", item);
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
/*
Fleur.XQueryEngine[Fleur.XQueryX.stringConstantExpr] = function(ctx, children, callback) {
  var n = new Fleur.Text();
  n.appendData(children[0][1][0] || "");
  n.schemaTypeInfo = Fleur.Type_string;
  Fleur.callback(function() {callback(n);});
};
*/