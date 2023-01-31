"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_concat = function(count) {
  if (this.item.isEmpty()) {
    this.item = new Fleur.Text();
    this.item.data = "";
  }
  const res = new Fleur.Text(this.item.data);
  for (let i = 1; i < count; i++) {
    const arg = this.itemstack.pop();
    if (arg.isNotEmpty()) {
      res.data = arg.data + res.data;
    }
  }
  res.schemaTypeInfo = Fleur.Type_string;
  this.item = res;
  return this;
};

Fleur.XPathFunctions_fn["concat#"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:concat", Fleur.Context.prototype.fn_concat,
  [], Fleur.SequenceType_string_1);
/*
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
*/