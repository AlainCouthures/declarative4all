"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.fn_nilled_0 = {
  need_ctx: false,
  is_async: false,
  return_type: {
    nodeType: Fleur.Node.TEXT_NODE,
    schemaTypeInfo: Fleur.Type_boolean,
    occurrence: "1"
  },
  params_type: []
};
Fleur.signatures.fn_nilled_1 = {
  need_ctx: false,
  is_async: false,
  return_type: {
    nodeType: Fleur.Node.TEXT_NODE,
    schemaTypeInfo: Fleur.Type_boolean,
    occurrence: "?"
  },
  params_type: [
    {
      occurrence: "1"
    }
  ]
};

Fleur.XPathFunctions_fn["nilled#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:nilled",
  function(ctx) {
    return Fleur.XPathFunctions_fn["nilled#1"].jsfunc(ctx._curr);
  },
  null, [], true, false, {type: Fleur.Type_boolean});

Fleur.XPathFunctions_fn["nilled#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:nilled",
  function(node) {
    if (node === Fleur.EmptySequence) {
      return null;
    }
    if ((node.nodeType === Fleur.Node.TEXT_NODE && node.schemaTypeInfo !== Fleur.Type_untypedAtomic) || node.nodeType === Fleur.Node.FUNCTION_NODE) {
      var e = new Error("");
      e.name = "XPTY0004";
      return e;
    }
    return false;
  },
  null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_boolean});