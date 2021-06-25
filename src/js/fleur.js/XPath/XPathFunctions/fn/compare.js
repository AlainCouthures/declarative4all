/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.fn_compare_2 = {
  need_ctx: false,
  is_async: false,
  return_type: {
    nodeType: Fleur.Node.TEXT_NODE,
    schemaTypeInfo: Fleur.Type_integer,
    occurrence: "?"
  },
  params_type: [
    {
      nodeType: Fleur.Node.TEXT_NODE,
      schemaTypeInfo: Fleur.Type_string,
      occurrence: "?"
    },
    {
      nodeType: Fleur.Node.TEXT_NODE,
      schemaTypeInfo: Fleur.Type_string,
      occurrence: "?"
    }
  ]
};

Fleur.XPathFunctions_fn["compare#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:compare",
  function(comparand1, comparand2) {
    return comparand1 === null || comparand2 === null ? null : comparand1 === comparand2 ? 0 : comparand1 < comparand2 ? -1 : 1;
  },
  null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_integer, occurence: "?"});

Fleur.XPathFunctions_fn["compare#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:compare",
  function(comparand1, comparand2, collation) {
    var c = Fleur.getCollation(collation);
    if (!c) {
      var e = new Error("");
      e.name = "FOCH0002";
      return e;
    }
    return comparand1 === null || comparand2 === null ? null : c.equals(comparand1, comparand2) ? 0 : c.lessThan(comparand1, comparand2) ? -1 : 1;
  },
  null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_integer, occurence: "?"});