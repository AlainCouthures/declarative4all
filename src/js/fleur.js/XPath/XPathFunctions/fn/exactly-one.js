"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_exactly$_one_1 = function() {
  if (this.item.nodeType === Fleur.Node.SEQUENCE_NODE) {
    Fleur.XQueryError_xqt("FORG0005", null, "Wrong argument type for fn:exactly-one#1", "", this.item);
  }
  return this;
};

Fleur.XPathFunctions_fn["exactly-one#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:exactly-one", Fleur.Context.prototype.fn_exactly$_one_1,
  [Fleur.SequenceType_item_0n], Fleur.SequenceType_item_1, {dynonly: true});
/*  function(arg, ctx) {
    if (arg.nodeType === Fleur.Node.SEQUENCE_NODE) {
      var err = Fleur.error(ctx, "FORG0005");
      var result = err;
      arg.childNodes.forEach(function(c) {
        if (c.schemaTypeInfo === Fleur.Type_error && result === err) {
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