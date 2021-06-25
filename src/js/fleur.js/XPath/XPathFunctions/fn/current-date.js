"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.fn_current$_date_0 = {
  need_ctx: false,
  is_async: false,
  return_type: {
    nodeType: Fleur.Node.TEXT_NODE,
    schemaTypeInfo: Fleur.Type_date,
    occurrence: "1"
  },
  params_type: []
};

Fleur.XPathFunctions_fn["current-date#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:current-date",
  function(ctx) {
    return ctx.env.now;
  },
  null, [], true, false, {type: Fleur.Type_date});