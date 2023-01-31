"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.xqx_valueComp = function(f) {
  const arg1 = this.itemstack.pop();
  const arg2 = this.item;
  if (arg2.nodeType === Fleur.Node.SEQUENCE_NODE) {
    this.item = new Fleur.Sequence();
    return this;
  }
  const op1 = Fleur.toJSValue(arg1, arg1.schemaTypeInfo !== Fleur.Type_untypedAtomic, true, true, true, false, true);
  if (op1[0] < 0) {
    this.item = arg1;
    return this;
  }
  if (Fleur.numericTypes.indexOf(arg1.schemaTypeInfo) !== -1) {
    arg1.schemaTypeInfo = Fleur.Type_double;
  } else if (arg1.schemaTypeInfo === Fleur.Type_untypedAtomic) {
    arg1.schemaTypeInfo = Fleur.Type_string;
  }
  if (arg2.nodeType === Fleur.Node.SEQUENCE_NODE) {
    this.item = new Fleur.Sequence();
    return;
  }
  const op2 = Fleur.toJSValue(arg2, arg2.schemaTypeInfo !== Fleur.Type_untypedAtomic, true, true, true, false, true);
  if (op2[0] < 0) {
    return this;
  }
  if (Fleur.numericTypes.indexOf(arg2.schemaTypeInfo) !== -1) {
    arg2.schemaTypeInfo = Fleur.Type_double;
  } else if (arg2.schemaTypeInfo === Fleur.Type_untypedAtomic) {
    arg2.schemaTypeInfo = Fleur.Type_string;
  }
  if (arg1.schemaTypeInfo !== arg2.schemaTypeInfo) {
    this.item = Fleur.error(this.ctx, "XPTY0004");
    return this;
  }
  this.item.data = String(f(op1, op2, Fleur.getCollation("http://www.w3.org/2005/xpath-functions/collation/codepoint")));
  this.item.schemaTypeInfo = Fleur.Type_boolean;
  return this;
};