"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.fn_string$_join_1 = {
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
      occurrence: "*"
    }
  ]
};
Fleur.signatures.fn_string$_join_2 = {
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
      occurrence: "*"
    },
    {
      nodeType: Fleur.Node.TEXT_NODE,
      schemaTypeInfo: Fleur.Type_string,
      occurrence: "?"
    }
  ]
};

Fleur.XPathFunctions_fn["string-join#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:string-join",
  function(arg1) {
    return Fleur.XPathFunctions_fn["string-join#2"].jsfunc(arg1, "");
  },
  null, [{type: Fleur.Type_string, occurence: "*"}], false, false, {type: Fleur.Type_string});

Fleur.XPathFunctions_fn["string-join#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:string-join",
  function(arg1, arg2) {
    return arg1 instanceof Array ? arg1.join(arg2 || "") : arg1;
  },
  null, [{type: Fleur.Type_string, occurence: "*"}, {type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_string});