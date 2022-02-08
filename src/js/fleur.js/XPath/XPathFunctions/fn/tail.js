"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
 Fleur.signatures.fn_tail_1 = {
  need_ctx: false,
  is_async: false,
  return_type: null,
  params_type: [
    null
  ]
};

Fleur.Context.prototype.fn_tail_1 = function() {
  if (this.item.nodeType === Fleur.Node.SEQUENCE_NODE && this.item.childNodes.length !== 0) {
    if (this.item.childNodes.length > 2) {
      const result = new Fleur.Sequence();
      for (let i = 1, l = this.item.childNodes.length; i < l; i++) {
        result.appendChild(this.item.childNodes[i]);
      }
      this.item = result;
    } else {
      this.item = this.item.childNodes[1];
    }
  } else if (this.item.nodeType !== Fleur.Node.SEQUENCE_NODE) {
    this.item = new Fleur.Sequence();
  }
  return this;
};

Fleur.XPathFunctions_fn["tail#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:tail",
  function(arg) {
    if (arg === Fleur.EmptySequence || arg.nodeType !== Fleur.Node.SEQUENCE_NODE) {
      return Fleur.EmptySequence;
    }
    if (arg.childNodes.length > 2) {
      var result = new Fleur.Sequence();
      for (var i = 1, l = arg.childNodes.length; i < l; i++) {
        result.appendChild(arg.childNodes[i]);
      }
      return result;
    }
    return arg.childNodes[1];
  },
  null, [{type: Fleur.Node, occurence: "*"}], false, false, {type: Fleur.Node, occurence: "*"});