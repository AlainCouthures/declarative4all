"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_nilled_0 = function() {
  this.notyet();
};
Fleur.Context.prototype.fn_nilled_1 = function() {
  this.notyet();
};

Fleur.XPathFunctions_fn["nilled#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:nilled", Fleur.Context.prototype.fn_nilled_0,
  [], Fleur.SequenceType_boolean_01);

Fleur.XPathFunctions_fn["nilled#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:nilled", Fleur.Context.prototype.fn_nilled_1,
  [Fleur.SequenceType_item_01], Fleur.SequenceType_boolean_01);
/*
  function(ctx) {
    return Fleur.XPathFunctions_fn["nilled#1"].jsfunc(ctx._curr);
  },
  null, [], true, false, {type: Fleur.Type_boolean});
*/
/*
  function(node) {
    if (node === Fleur.EmptySequence) {
      return null;
    }
    if ((node.nodeType === Fleur.Node.TEXT_NODE && node.schemaTypeInfo !== Fleur.Type_untypedAtomic) || node.nodeType === Fleur.Node.FUNCTION_NODE) {
      var e = new Error("");
      e.name = "XPTY0004";
      return e;
    }
    return false;
  },
  null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_boolean});
*/