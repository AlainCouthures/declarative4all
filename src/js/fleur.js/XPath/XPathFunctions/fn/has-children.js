"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.fn_has$_children_1 = {
  need_ctx: false,
  is_async: false,
  return_type: {
    nodeType: Fleur.Node.TEXT_NODE,
    schemaTypeInfo: Fleur.Type_boolean,
    occurrence: "1"
  },
  params_type: [
    {
      occurrence: "?"
    }
  ]
};

Fleur.XPathFunctions_fn["has-children#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:has-children",
  function(ctx) {
    return Fleur.XPathFunctions_fn["has-children#1"].jsfunc(ctx._curr);
  },
  null, [], true, false, {type: Fleur.Type_boolean});

Fleur.XPathFunctions_fn["has-children#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:has-children",
  function(node) {
    if (node === null) {
      return false;
    }
    if ((node.nodeType === Fleur.Node.TEXT_NODE && node.schemaTypeInfo !== Fleur.Type_untypedAtomic) || node.nodeType === Fleur.Node.FUNCTION_NODE) {
      var e = new Error("");
      e.name = "XPTY0004";
      return e;
    }
    if (node.nodeType !== Fleur.Node.SEQUENCE_NODE && node.nodeType !== Fleur.Node.ATTRIBUTE_NODE) {
      return node.childNodes && node.childNodes.length !== 0;
    }
    return false;
  },
  null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_boolean});