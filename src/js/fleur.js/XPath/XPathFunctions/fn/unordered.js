"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_unordered_1 = function() {
  return this;
};

Fleur.XPathFunctions_fn["unordered#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:unordered", Fleur.Context.prototype.fn_unordered_1,
  [Fleur.SequenceType_item_0n], Fleur.SequenceType_item_0n);
/*
  function(sourceSeq) {
    return sourceSeq;
  },
  null, [{type: Fleur.Node, occurence: "*"}], false, false, {type: Fleur.Node, occurence: "*"});
*/