"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.xqx_generalComp = function(f) {
  let arg1 = this.itemstack.pop();
  const arg2 = this.item;
  const res = new Fleur.Text();
  res.schemaTypeInfo = Fleur.Type_boolean;
  if (arg1.isEmpty() || arg2.isEmpty()) {
    res.data = "false";
    this.item = res;
    return this;
  }
  let bres = false;
  const itemtype = item => {
    if (Fleur.numericTypes.indexOf(item.schemaTypeInfo) !== -1) {
      const itemt = new Fleur.Text(item.data);
      itemt.schemaTypeInfo = Fleur.Type_double;
      return itemt;
    } else if (item.schemaTypeInfo === Fleur.Type_untypedAtomic) {
      const itemt = new Fleur.Text(item.data);
      itemt.schemaTypeInfo = Fleur.Type_string;
      return itemt;
    }
    return item;
  };
  const itemcomp = item1 => {
    const item1t = itemtype(item1);
    const op1 = Fleur.toJSValue(item1t, true, true, true, true, false, true);
    if (arg2.nodeType === Fleur.Node.SEQUENCE_NODE) {
      for (let b = 0, lb = arg2.childNodes.length; b < lb && !bres; b++) {
        const item2t = itemtype(arg2.childNodes[b]);
        const op2 = Fleur.toJSValue(item2t, true, true, true, true, false, true);
        bres = f(op1, op2, Fleur.getCollation("http://www.w3.org/2005/xpath-functions/collation/codepoint"));
      }
    } else {
      const item2t = itemtype(arg2);
      const op2 = Fleur.toJSValue(item2t, true, true, true, true, false, true);
      bres = f(op1, op2, Fleur.getCollation("http://www.w3.org/2005/xpath-functions/collation/codepoint"));
    }
  };
  if (arg1.nodeType === Fleur.Node.SEQUENCE_NODE) {
    for (let a = 0, la = arg1.childNodes.length; a < la && !bres; a++) {
      itemcomp(arg1.childNodes[a]);
    }
  } else {
    itemcomp(arg1);
  }
  res.data = String(bres);
  this.item = res;
  return this;
};