"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.fn_string_0 = {
  need_ctx: false,
  is_async: false,
  return_type: {
    nodeType: Fleur.Node.TEXT_NODE,
    schemaTypeInfo: Fleur.Type_string,
    occurrence: "1"
  },
  params_type: []
};
Fleur.signatures.fn_string_1 = {
  need_ctx: false,
  is_async: false,
  return_type: {
    nodeType: Fleur.Node.TEXT_NODE,
    schemaTypeInfo: Fleur.Type_string,
    occurrence: "1"
  },
  params_type: [
    {
      occurrence: "?"
    }
  ]
};
Fleur.Context.prototype.fn_string_1 = function() {
  const newitem = new Fleur.Text(this.item.data);
  newitem.schemaTypeInfo = Fleur.Type_string;
  this.item = newitem;
  return this;
};

Fleur.XPathFunctions_fn["string#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:string",
  function(ctx) {
    return Fleur.XPathFunctions_fn["string#1"].jsfunc(ctx._curr);
  },
  null, [], true, false, {type: Fleur.Type_string});

Fleur.XPathFunctions_fn["string#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:string",
  function(arg) {
    if (arg === Fleur.EmptySequence) {
      return "";
    }
    var a = Fleur.Atomize(arg);
    return a.data;
  },
  null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_string});