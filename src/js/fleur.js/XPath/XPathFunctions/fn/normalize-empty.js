"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.fn_normalize$_empty_0 = {
  need_ctx: false,
  is_async: false,
  return_type: {
    nodeType: Fleur.Node.TEXT_NODE,
    schemaTypeInfo: Fleur.Type_string,
    occurrence: "1"
  },
  params_type: []
};
Fleur.signatures.fn_normalize$_empty_1 = {
  need_ctx: false,
  is_async: false,
  return_type: {
    nodeType: Fleur.Node.TEXT_NODE,
    schemaTypeInfo: Fleur.Type_string,
    occurrence: "1"
  },
  params_type: [
    {
      nodeType: Fleur.Node.TEXT_NODE,
      schemaTypeInfo: Fleur.Type_string,
      occurrence: "?"
    }
  ]
};

Fleur.XPathFunctions_fn["normalize-empty#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:normalize-empty",
  function(ctx) {
    return ctx._curr && ctx._curr.textContent !== "" ? ctx._curr.textContent : null;
  },
  null, [], true, false, {type: Fleur.Type_string});

Fleur.XPathFunctions_fn["normalize-empty#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:normalize-empty",
  function(arg) {
    return arg && arg !== "" ? arg : null;
  },
  null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_string});