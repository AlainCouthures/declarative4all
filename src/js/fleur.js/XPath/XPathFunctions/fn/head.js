"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
 Fleur.signatures.fn_head_1 = {
  need_ctx: false,
  is_async: false,
  return_type: null,
  params_type: [
    {
      occurrence: "*"
    }
  ]
};
Fleur.Context.prototype.fn_head_1 = function() {
  if (this.item.nodeType === Fleur.Node.SEQUENCE_NODE && this.item.childNodes.length !== 0) {
    this.item = this.item.childNodes[0];
  }
  return this;
};

Fleur.XPathFunctions_fn["head#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:head",
  function(arg) {
    return arg === Fleur.EmptySequence || arg.nodeType !== Fleur.Node.SEQUENCE_NODE ? arg : arg.childNodes[0];
  },
  null, [{type: Fleur.Node, occurence: "*"}], false, false, {type: Fleur.Node});