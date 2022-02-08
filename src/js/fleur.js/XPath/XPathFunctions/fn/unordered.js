"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
 Fleur.signatures.fn_unordered_1 = {
  need_ctx: false,
  is_async: false,
  return_type: null,
  params_type: [
    null
  ]
};

Fleur.XPathFunctions_fn["unordered#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:unordered",
  function(sourceSeq) {
    return sourceSeq;
  },
  null, [{type: Fleur.Node, occurence: "*"}], false, false, {type: Fleur.Node, occurence: "*"});