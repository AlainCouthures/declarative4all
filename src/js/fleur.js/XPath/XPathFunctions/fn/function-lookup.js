"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_function$_lookup_2 = function() {
  const arity = this.item;
  const fqname = this.itemstack.pop();
  if (fqname.isNotEmpty()) {
    const func = Fleur.XPathFunctions[fqname.namespaceURI] ? Fleur.XPathFunctions[fqname.namespaceURI][fqname.localName + "#" + arity.data] || null : null;
    this.item = func ? func : new Fleur.Sequence();
  } else {
    this.item = fqname;
  }
  return this;
};

Fleur.XPathFunctions_fn["function-lookup#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:function-lookup", Fleur.Context.prototype.fn_function$_lookup_2,
  [Fleur.SequenceType_QName_1, Fleur.SequenceType_integer_1], Fleur.SequenceType_function_01);
/*
  function(fqname, arity) {
    if (fqname.namespaceURI === "http://www.w3.org/2005/xpath-functions" && fqname.localName === "concat" && arity > 1 && !Fleur.XPathFunctions[fqname.namespaceURI][fqname.localName + "#" + arity]) {
      var cparam = [];
      for (var i = 0; i < arity; i++) {
        cparam[i] = {type: Fleur.Node};
      }
      Fleur.XPathFunctions[fqname.namespaceURI][fqname.localName + "#" + arity] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:concat", Fleur.XPathFunctions_fn["concat#"].jsfunc, null, cparam, false, false, {type: Fleur.Type_string});
    }
    return Fleur.XPathFunctions[fqname.namespaceURI] ? Fleur.XPathFunctions[fqname.namespaceURI][fqname.localName + "#" + arity] || null : null;
  },
  null, [{type: Fleur.Type_QName}, {type: Fleur.Type_integer}], false, false, {type: Fleur.Node});
*/