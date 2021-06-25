"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.fn_implicit$_timezone_0 = {
  need_ctx: false,
  is_async: false,
  return_type: {
    nodeType: Fleur.Node.TEXT_NODE,
    schemaTypeInfo: Fleur.Type_dayTimeDuration,
    occurrence: "?"
  },
  params_type: []
};

Fleur.XPathFunctions_fn["implicit-timezone#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:implicit-timezone",
  function(ctx) {
    var a = new Fleur.Text();
    a.schemaTypeInfo = Fleur.Type_dayTimeDuration;
    a.data = ctx.env.timezone;
    return a;
  },
  null, [], true, false, {type: Fleur.Node, occurence: "?"});