/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.fn_concat = {
  need_ctx: false,
  is_async: false,
  return_type: {
    nodeType: Fleur.Node.TEXT_NODE,
    schemaTypeInfo: Fleur.Type_string,
    occurrence: "1"
  },
  params_type: [
    {
      nodeType: Fleur.Node.TEXT_NODE,
      schemaTypeInfo: Fleur.Type_string,
      occurrence: "?"
    }
  ]
};
Fleur.Context.prototype.fn_concat = function(count) {
  if (this.item.isEmpty()) {
    this.item = new Fleur.Text();
    this.item.data = "";
    this.item.schemaTypeInfo = Fleur.Type_string;
  }
  for (let i = 1; i < count; i++) {
    const arg = this.itemstack.pop();
    if (arg.isNotEmpty()) {
      this.item.data = arg.data + this.item.data;
    }
  }
  return this;
};

Fleur.XPathFunctions_fn["concat#"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:concat",
  function() {
    var s = "";
    var e;
    for (var i = 0, l = arguments.length; i < l; i++) {
      var n = arguments[i];
      if (n !== Fleur.EmptySequence && n.nodeType === Fleur.Node.SEQUENCE_NODE) {
        e = new Error("The dynamic type of a value does not match a required type for Q{http://www.w3.org/2005/xpath-functions}concat#" + String(l));
        e.name = "XPTY0004";
        return e;
      }
      if (n.nodeType === Fleur.Node.FUNCTION_NODE) {
        e = new Error("The dynamic type of a value does not match a required type for Q{http://www.w3.org/2005/xpath-functions}concat#" + String(l));
        e.name = "FOTY0013";
        return e;
      }
      var a = Fleur.Atomize(n);
      if (a.schemaTypeInfo === Fleur.Type_error) {
        return a;
      }
      s += a.data || "";
    }
    return s;
  },
  null, [], false, false, {type: Fleur.Type_string});