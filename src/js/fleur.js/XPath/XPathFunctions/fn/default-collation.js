/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.fn_default$_collation_0 = {
  need_ctx: false,
  is_async: false,
  return_type: {
    nodeType: Fleur.Node.TEXT_NODE,
    schemaTypeInfo: Fleur.Type_string,
    occurrence: "1"
  },
  params_type: []
};

Fleur.XPathFunctions_fn["default-collation#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:default-collation",
  function() {
    return "http://www.w3.org/2005/xpath-functions/collation/codepoint";
  },
  null, [], false, false, {type: Fleur.Type_string});