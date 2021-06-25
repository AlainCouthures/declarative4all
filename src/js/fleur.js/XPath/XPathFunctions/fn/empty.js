"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.fn_empty_1 = {
  need_ctx: false,
  is_async: false,
  return_type: {
    nodeType: Fleur.Node.TEXT_NODE,
    schemaTypeInfo: Fleur.Type_boolean,
    occurrence: "1"
  },
  params_type: [null]
};
Fleur.Context.prototype.fn_empty_1 = function() {
  const isempty = this.item.isEmpty();
  this.item = new Fleur.Text();
  this.item.data = String(isempty);
  this.item.schemaTypeInfo = Fleur.Type_boolean;
  return this;
};

Fleur.XPathFunctions_fn["empty#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:empty",
  function(arg) {
    return arg === Fleur.EmptySequence;
  },
  null, [{type: Fleur.Node, occurence: "*"}], false, false, {type: Fleur.Type_boolean});