"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.fn_format$_date_2 = {
  need_ctx: false,
  is_async: false,
  return_type: {
    nodeType: Fleur.Node.TEXT_NODE,
    schemaTypeInfo: Fleur.Type_string,
    occurrence: "?"
  },
  params_type: [
    {
      nodeType: Fleur.Node.TEXT_NODE,
      schemaTypeInfo: Fleur.Type_date,
      occurrence: "?"
    },
    {
      nodeType: Fleur.Node.TEXT_NODE,
      schemaTypeInfo: Fleur.Type_string,
      occurrence: "1"
    }
  ]
};

Fleur.XPathFunctions_fn["format-date#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:format-date",
  function(value, picture, ctx) {
    return Fleur.XPathFunctions_fn["format-dateTime#5"].jsfunc(value, picture, null, null, null, ctx, true, false);
  },
  null, [{type: Fleur.Type_date, occurence: "?"}, {type: Fleur.Type_string}], true, false, {type: Fleur.Type_string, occurence: "?"});

Fleur.XPathFunctions_fn["format-date#5"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:format-date",
  function(value, picture, language, calendar, place, ctx) {
    return Fleur.XPathFunctions_fn["format-dateTime#5"].jsfunc(value, picture, language, calendar, place, ctx, true, false);
  },
  null, [{type: Fleur.Type_date, occurence: "?"}, {type: Fleur.Type_string}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}], true, false, {type: Fleur.Type_string, occurence: "?"});