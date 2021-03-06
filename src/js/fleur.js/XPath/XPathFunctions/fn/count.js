"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.fn_count_1 = {
  need_ctx: false,
  is_async: false,
  return_type: {
    nodeType: Fleur.Node.TEXT_NODE,
    schemaTypeInfo: Fleur.Type_integer,
    occurrence: "1"
  },
  params_type: [
    {
      occurrence: "*"
    }
  ]
};
Fleur.Context.prototype.fn_count_1 = function() {
  const count = this.item.nodeType === Fleur.Node.SEQUENCE_NODE ? this.item.childNodes.length : 1;
  this.item = new Fleur.Text();
  this.item.data = String(count);
  this.item.schemaTypeInfo = Fleur.Type_integer;
  return this;
};

Fleur.XPathFunctions_fn["count#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:count",
  function(arg) {
    return arg === Fleur.EmptySequence ? 0 : arg.nodeType === Fleur.Node.SEQUENCE_NODE ? arg.childNodes.length : 1;
  },
  null, [{type: Fleur.Node, occurence: "*"}], false, false, {type: Fleur.Type_integer});