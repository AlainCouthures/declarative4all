"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
 Fleur.signatures.fn_substring$_before_2 = {
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
    },
    {
      nodeType: Fleur.Node.TEXT_NODE,
      schemaTypeInfo: Fleur.Type_string,
      occurrence: "?"
    }
  ]
};
Fleur.signatures.fn_substring$_before_3 = {
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
    },
    {
      nodeType: Fleur.Node.TEXT_NODE,
      schemaTypeInfo: Fleur.Type_string,
      occurrence: "?"
    },
    {
      nodeType: Fleur.Node.TEXT_NODE,
      schemaTypeInfo: Fleur.Type_string,
      occurrence: "1"
    }
  ]
};

Fleur.Context.prototype.fn_substring$_before_2 = function() {
  const arg1 = this.itemstack.pop();
  const arg2 = this.item;
  if (arg1.isNotEmpty() && arg2.isNotEmpty()) {
    this.item.data = arg1.data.substring(0, arg1.data.indexOf(arg2.data));
  } else {
    this.item = new Fleur.Text();
    this.item.data = "";
  }
  this.item.schemaTypeInfo = Fleur.Type_string;
  return this;
};

Fleur.XPathFunctions_fn["substring-before#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:substring-before",
  function(a, b) {
    return !a || !b ? "" : a.substring(0, a.indexOf(b));
  },
  null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_string, occurence: "?"});

Fleur.XPathFunctions_fn["substring-before#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:substring-before",
  function(a, b, collation) {
    var c = Fleur.getCollation(collation);
    if (!c) {
      var e = new Error("");
      e.name = "FOCH0002";
      return e;
    }
    return !a || !b ? "" : c.substringBefore(a, b);
  },
  null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_string, occurence: "?"});