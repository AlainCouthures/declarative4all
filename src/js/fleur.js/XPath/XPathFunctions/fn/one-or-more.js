"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_one$_or$_more_1 = function() {
  if (this.item.isEmpty()) {
    Fleur.XQueryError_xqt("FORG0004", null, "Wrong argument type for fn:one-or-more#1", "", this.item);
  }
  return this;
};

Fleur.XPathFunctions_fn["one-or-more#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:one-or-more", Fleur.Context.prototype.fn_one$_or$_more_1,
  [Fleur.SequenceType_item_0n], Fleur.SequenceType_item_1n);
/*
  function(arg, ctx) {
    if (arg === Fleur.EmptySequence) {
      return Fleur.error(ctx, "FORG0004");
    }
    if (arg.nodeType === Fleur.Node.SEQUENCE_NODE) {
      var result = arg;
      arg.childNodes.forEach(function(c) {
        if (c.schemaTypeInfo === Fleur.Type_error && result === arg) {
          result = c;
        }
      });
      return result;
    } else {
      return arg;
    }
  },
  null, [{type: Fleur.Node, occurence: "*"}], true, false, {type: Fleur.Node});
*/