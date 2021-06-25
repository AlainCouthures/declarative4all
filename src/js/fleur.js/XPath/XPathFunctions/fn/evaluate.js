"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.fn_evaluate_1 = {
  need_ctx: false,
  is_async: false,
  return_type: null,
  params_type: [
    {
      nodeType: Fleur.Node.TEXT_NODE,
      schemaTypeInfo: Fleur.Type_string,
      occurrence: "?"
    }
  ]
};
Fleur.Context.prototype.fn_evaluate_1 = function() {
  if (this.item.isNotEmpty()) {
    const jsret = Fleur.XPathEvaluator._xp2js(this.item.data, "", "");
    let arr;
    eval("arr = " + jsret + ";");
    try {
      const jsresult = (new Fleur.Transpiler("ctx", "  ")).funcdef(arr);
      try {
        this.item = (eval("(" + jsresult + ")(new Fleur.Context())")).item;
      } catch(e) {}
    } catch(e) {}
  }
  return this;
};

Fleur.XPathFunctions_fn["evaluate#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:evaluate",
  function(arg) {
    return arg !== Fleur.EmptySequence;
  },
  null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Node, occurence: "*"});