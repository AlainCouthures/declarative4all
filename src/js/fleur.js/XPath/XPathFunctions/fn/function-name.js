"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["function-name#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:function-name",
  function(f) {
    var  a = new Fleur.Text();
    a.schemaTypeInfo = Fleur.Type_QName;
    a._setNodeNameLocalNamePrefix(f.namespaceURI, f.nodeName);
    return a;
  },
  null, [{type: Fleur.Node}], false, false, {type: Fleur.Type_QName});