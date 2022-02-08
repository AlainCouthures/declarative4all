"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.fn_xsi$_type_1 = {
  need_ctx: false,
  is_async: false,
  return_type: {
    nodeType: Fleur.Node.ATTRIBUTE_NODE,
    occurrence: "?"
  },
  params_type: [
    {
     occurrence: "?"
    }
  ]
};

Fleur.XPathFunctions_fn["xsi-type#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:xsi-type",
  function(n, ctx) {
    if (!n.schemaTypeInfo || (n.schemaTypeInfo.typeNamespace === "http://www.w3.org/2001/XMLSchema" && (n.schemaTypeInfo.typeName === "untypedAtomic" || n.schemaTypeInfo.typeName === "string"))) {
      return null;
    }
    var  a = new Fleur.Attr();
    a.nodeName = "xsi:type";
    a.localName = "type";
    a.namespaceURI = "http://www.w3.org/2001/XMLSchema-instance";
    var t = new Fleur.Text();
    t.data = ctx.env.nsresolver.lookupPrefix(n.schemaTypeInfo.typeNamespace) + ":" + n.schemaTypeInfo.typeName;
    a.appendChild(t);
    return a;
  },
  null, [{type: Fleur.Node, occurence: "?"}], true, false, {type: Fleur.Node});