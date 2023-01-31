"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_QName_2 = function() {
  const paramQName = this.item;
  const paramURI = this.itemstack.pop();
  this.item = new Fleur.Text();
  this.item.schemaTypeInfo = Fleur.Type_QName;
  this.item._setNodeNameLocalNamePrefix(paramURI.isNotEmpty() ? paramURI.data : "", paramQName.data);
  return this;
};

Fleur.XPathFunctions_fn["QName#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:QName", Fleur.Context.prototype.fn_QName_2,
  [Fleur.SequenceType_string_01, Fleur.SequenceType_string_1], Fleur.SequenceType_QName_1, {dynonly: true});
/*
  function(paramURI, paramQName) {
    var  a = new Fleur.Text();
    a.schemaTypeInfo = Fleur.Type_QName;
    a._setNodeNameLocalNamePrefix(paramURI, paramQName);
    return a;
  },
  null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_QName});
*/