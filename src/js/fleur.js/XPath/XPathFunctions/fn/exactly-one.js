"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.fn_exactly$_one_1 = {
  need_ctx: false,
  is_async: false,
  return_type: null,
  params_type: [
    {
      occurrence: "*"
    }
  ]
};
Fleur.Context.prototype.fn_exactly$_one_1 = function() {
  if (this.item.nodeType === Fleur.Node.SEQUENCE_NODE) {

  }
  return this;
};

Fleur.XPathFunctions_fn["exactly-one#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:exactly-one",
  function(arg, ctx) {
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