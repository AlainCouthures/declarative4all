"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.fn_parse$_xml_1 = {
  need_ctx: false,
  is_async: false,
  return_type: {
    occurrence: "?"
  },
  params_type: [
    {
      nodeType: Fleur.Node.TEXT_NODE,
      schemaTypeInfo: Fleur.Type_string,
      occurrence: "?"
    }
  ]
};

Fleur.XPathFunctions_fn["parse-xml#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:parse-xml",
  function(arg) {
    var parser = new Fleur.DOMParser();
    return arg !== null ? parser.parseFromString(arg, "application/xml") : null;
  },
  null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Node, occurence: "?"});