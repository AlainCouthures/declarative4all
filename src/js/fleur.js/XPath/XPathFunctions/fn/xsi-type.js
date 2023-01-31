"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_xsi$_type_1 = function() {
  if (this.item.isNotEmpty()) {
    const n = this.item;
    if (!n.schemaTypeInfo || (n.schemaTypeInfo.typeNamespace === "http://www.w3.org/2001/XMLSchema" && (n.schemaTypeInfo.typeName === "untypedAtomic" || n.schemaTypeInfo.typeName === "string"))) {
      this.item = new Fleur.Sequence();
    } else {
      const a = new Fleur.Attr();
      a.nodeName = "xsi:type";
      a.localName = "type";
      a.namespaceURI = "http://www.w3.org/2001/XMLSchema-instance";
      const t = new Fleur.Text();
      t.data = this.rs.nsresolver.lookupPrefix(n.schemaTypeInfo.typeNamespace) + ":" + n.schemaTypeInfo.typeName;
      a.appendChild(t);
      this.item = a;
    }
  }
  return this;
};

Fleur.XPathFunctions_fn["xsi-type#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:xsi-type", Fleur.Context.prototype.fn_xsi$_type_1,
  [Fleur.SequenceType_item_01], Fleur.SequenceType_attribute_01);
/*
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
*/