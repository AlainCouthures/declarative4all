"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.fn_function$_arity_1 = {
  need_ctx: false,
  is_async: false,
  return_type: {
    nodeType: Fleur.Node.TEXT_NODE,
    schemaTypeInfo: Fleur.Type_integer,
    occurrence: "1"
  },
  params_type: [
    {
      nodeType: Fleur.Node.FUNCTION_NODE,
      occurrence: "?"
    }
  ]
};

Fleur.XPathFunctions_fn["function-arity#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:function-arity",
  function(f) {
    return f.argtypes.length;
  },
  null, [{type: Fleur.Node}], false, false, {type: Fleur.Type_integer});