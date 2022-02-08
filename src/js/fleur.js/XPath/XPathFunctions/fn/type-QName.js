"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.fn_type$_QName_1 = {
  need_ctx: false,
  is_async: false,
  return_type: {
    nodeType: Fleur.Node.TEXT_NODE,
    schemaTypeInfo: Fleur.Type_QName,
    occurrence: "?"
  },
  params_type: [
    {
      occurrence: "?"
    }
  ]
};

Fleur.XPathFunctions_fn["type-QName#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:type-QName",
  function(n) {
    var  a = new Fleur.Text();
    a.schemaTypeInfo = Fleur.Type_QName;
    a._setNodeNameLocalNamePrefix(n.schemaTypeInfo ? n.schemaTypeInfo.typeNamespace : "http://www.w3.org/2001/XMLSchema", n.schemaTypeInfo ? n.schemaTypeInfo.typeName : "untypedAtomic");
    return a;
  },
  null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_QName});