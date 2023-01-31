"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_base_$uri_0 = function() {
  this.notyet();
};
Fleur.Context.prototype.fn_base_$uri_1 = function() {
  this.notyet();
};

Fleur.XPathFunctions_fn["base-uri#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:base-uri", Fleur.Context.prototype.fn_base_$uri_0,
  [], Fleur.SequenceType_anyURI_01);
Fleur.XPathFunctions_fn["base-uri#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:base-uri", Fleur.Context.prototype.fn_base_$uri_1,
  [Fleur.SequenceType_item_01], Fleur.SequenceType_anyURI_01);
/*
function(ctx) {
    return Fleur.XPathFunctions_fn["base-uri#1"].jsfunc(ctx._curr);
  },
  null, [], true, false, {type: Fleur.Type_anyURI});
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
    return "";
  },
  null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_anyURI});
*/