"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_function$_name_1 = function() {
  var  newitem = new Fleur.Text();
  newitem.schemaTypeInfo = Fleur.Type_QName;
  newitem._setNodeNameLocalNamePrefix(this.item.namespaceURI, this.item.nodeName);
  this.item = newitem;
  return this;
};

Fleur.XPathFunctions_fn["function-name#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:function-name", Fleur.Context.prototype.fn_function$_name_1,
  [Fleur.SequenceType_function_1], Fleur.SequenceType_QName_01);
/*
  function(f) {
    var  a = new Fleur.Text();
    a.schemaTypeInfo = Fleur.Type_QName;
    a._setNodeNameLocalNamePrefix(f.namespaceURI, f.nodeName);
    return a;
  },
  null, [{type: Fleur.Node}], false, false, {type: Fleur.Type_QName});
*/