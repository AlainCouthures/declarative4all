"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
 Fleur.signatures.fn_starts$_with_2 = {
  need_ctx: false,
  is_async: false,
  return_type: {
    nodeType: Fleur.Node.TEXT_NODE,
    schemaTypeInfo: Fleur.Type_boolean,
    occurrence: "1"
  },
  params_type: [
    {
      nodeType: Fleur.Node.TEXT_NODE,
      schemaTypeInfo: Fleur.Type_string,
      occurrence: "?"
    },
    {
      nodeType: Fleur.Node.TEXT_NODE,
      schemaTypeInfo: Fleur.Type_string,
      occurrence: "?"
    }
  ]
};
Fleur.Context.prototype.fn_starts$_with_2 = function() {
  const arg2 = this.item;
  const arg1 = this.itemstack.pop();
  if (arg2.isNotEmpty()) {
    if (arg1.isNotEmpty()) {
      this.item.data = String(arg1.data.startsWith(arg2.data));
    } else {
      this.item = new Fleur.Text();
      this.item.data = String(arg2.data.length === 0);
    }
  } else {
    this.item = new Fleur.Text();
    this.item.data = "true";
  }
  this.item.schemaTypeInfo = Fleur.Type_boolean;
  return this;
};

Fleur.XPathFunctions_fn["starts-with#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:starts-with",
  function(a, b) {
    return !b ? true : !a ? false : a.startsWith(b);
  },
  null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_boolean});

Fleur.XPathFunctions_fn["starts-with#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:starts-with",
  function(a, b, collation) {
    var c = Fleur.getCollation(collation);
    if (!c) {
      var e = new Error("");
      e.name = "FOCH0002";
      return e;
    }
    return !b ? true : !a ? false : c.startsWith(a, b);
  },
  null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_boolean});