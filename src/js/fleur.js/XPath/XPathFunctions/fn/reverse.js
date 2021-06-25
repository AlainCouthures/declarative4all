"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.fn_reverse_1 = {
  need_ctx: false,
  is_async: false,
  return_type: null,
  params_type: [
    null
  ]
};
Fleur.Context.prototype.fn_reverse_1 = function() {
  if (this.item.nodeType === Fleur.Node.SEQUENCE_NODE && this.item.childNodes.length !== 0) {
    const result = new Fleur.Sequence();
    let i = this.item.childNodes.length - 1;
    while (i >= 0) {
      result.appendChild(this.item.childNodes[i]);
      i--;
    }
    this.item = result;
  }
  return this;
};

Fleur.XPathFunctions_fn["reverse#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:reverse",
  function(arg) {
    if (arg === Fleur.EmptySequence) {
      return Fleur.EmptySequence;
    }
    if (arg.nodeType === Fleur.Node.SEQUENCE_NODE) {
      var result = new Fleur.Sequence();
      result.nodeType = Fleur.Node.SEQUENCE_NODE;
      var i = arg.childNodes.length - 1;
      while (i >= 0) {
        result.appendChild(arg.childNodes[i]);
        i--;
      }
      return result;
    }
    return arg;
  },
  null, [{type: Fleur.Node, occurence: "*"}], false, false, {type: Fleur.Node, occurence: "*"});