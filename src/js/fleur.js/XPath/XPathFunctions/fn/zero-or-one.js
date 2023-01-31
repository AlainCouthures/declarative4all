"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.fn_zero$_or$_one_1 = function() {
  if (this.item.isNotEmpty() && this.item.nodeType === Fleur.Node.SEQUENCE_NODE) {
    Fleur.XQueryError_xqt("FORG0004", null, "Wrong argument type for fn:zero-or-one#1", "", this.item);
  }
  return this;
};

Fleur.XPathFunctions_fn["zero-or-one#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:zero-or-one", Fleur.signatures.fn_zero$_or$_one_1,
  [Fleur.SequenceType_item_0n], Fleur.SequenceType_item_01);
/*
  function(arg, ctx) {
    if (arg.nodeType === Fleur.Node.SEQUENCE_NODE && arg.childNodes && arg.childNodes.length > 1) {
      return Fleur.error(ctx, "FORG0003");
    }
    return arg;
  },
  null, [{type: Fleur.Node, occurence: "*"}], true, false, {type: Fleur.Node});
*/