"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.fn_timezone$_from$_time_1 = {
  need_ctx: false,
  is_async: false,
  return_type: {
    nodeType: Fleur.Node.TEXT_NODE,
    schemaTypeInfo: Fleur.Type_dayTimeDuration,
    occurrence: "?"
  },
  params_type: [
    {
      nodeType: Fleur.Node.TEXT_NODE,
      schemaTypeInfo: Fleur.Type_time,
      occurrence: "?"
    }
  ]
};

Fleur.XPathFunctions_fn["timezone-from-time#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:timezone-from-time",
  function(arg) {
    return Fleur.XPathFunctions_fn["timezone-from-dateTime#1"].jsfunc(arg, false, true);
  },
  null, [{type: Fleur.Type_time, occurence: "?"}], false, false, {type: Fleur.Node, occurence: "?"});