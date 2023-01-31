"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_type$_QName_1 = function() {
  if (this.item.isNotEmpty()) {
    const n = this.item;
    this.item = new Fleur.Text();
    this.item.schemaTypeInfo = Fleur.Type_QName;
    this.item._setNodeNameLocalNamePrefix(n.schemaTypeInfo ? n.schemaTypeInfo.typeNamespace : "http://www.w3.org/2001/XMLSchema", n.schemaTypeInfo ? n.schemaTypeInfo.typeName : "untypedAtomic");
  }
  return this;
};

Fleur.XPathFunctions_fn["type-QName#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:type-QName", Fleur.Context.prototype.fn_type$_QName_1,
  [Fleur.SequenceType_item_01], Fleur.SequenceType_QName_01);
/*
  function(n) {
    var a = new Fleur.Text();
    a.schemaTypeInfo = Fleur.Type_QName;
    a._setNodeNameLocalNamePrefix(n.schemaTypeInfo ? n.schemaTypeInfo.typeNamespace : "http://www.w3.org/2001/XMLSchema", n.schemaTypeInfo ? n.schemaTypeInfo.typeName : "untypedAtomic");
    return a;
  },
  null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_QName});
*/