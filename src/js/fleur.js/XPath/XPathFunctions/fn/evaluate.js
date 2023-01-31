"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_evaluate_1 = function() {
  if (this.item.isNotEmpty()) {
    const jsret = Fleur.XQueryParser._xp2js(this.item.data, [], [], 0);
    try {
      const jsresult = (new Fleur.Transpiler("ctx", "  ")).funcdef(jsret);
      try {
        this.item = (eval("(" + jsresult.inst + ")(new Fleur.Context())")).item;
      } catch(e) {}
    } catch(e) {}
  }
  return this;
};

Fleur.XPathFunctions_fn["evaluate#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:evaluate", Fleur.Context.prototype.fn_evaluate_1,
  [Fleur.SequenceType_string_01], Fleur.SequenceType_item_0n, {dynonly: true});
/*
  function(arg) {
    return arg !== Fleur.EmptySequence;
  },
  null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Node, occurence: "*"});
*/