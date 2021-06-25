"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.fn_seconds$_from$_dateTime_1 = {
  need_ctx: false,
  is_async: false,
  return_type: {
    nodeType: Fleur.Node.TEXT_NODE,
    schemaTypeInfo: Fleur.Type_decimal,
    occurrence: "?"
  },
  params_type: [
    {
      nodeType: Fleur.Node.TEXT_NODE,
      schemaTypeInfo: Fleur.Type_dateTime,
      occurrence: "?"
    }
  ]
};

Fleur.XPathFunctions_fn["seconds-from-dateTime#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:seconds-from-dateTime",
  function(arg) {
    return arg !== null ? parseFloat(arg.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:(\d{2}(?:\.\d+)?)(?:Z|[+\-]\d{2}:\d{2})?$/)[1]) : null;
  },
  null, [{type: Fleur.Type_dateTime, occurence: "?"}], true, false, {type: Fleur.Type_decimal, occurence: "?"});