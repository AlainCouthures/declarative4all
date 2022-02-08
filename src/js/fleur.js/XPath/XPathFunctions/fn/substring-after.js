"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.fn_substring$_after_2 = {
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
Fleur.signatures.fn_substring$_after_3 = {
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

Fleur.Context.prototype.fn_substring$_after_2 = function() {
  const arg2 = this.item;
  const arg1 = this.itemstack.pop();
  if (arg1.isNotEmpty()) {
    if (arg2.isNotEmpty() || arg2.data === "") {
      const index = arg1.data.indexOf(arg2.data);
      this.item.data = index === -1 ? "" : arg1.data.substring(index + arg2.data.length);
    } else {
      this.item = new Fleur.Text();
      this.item.data = arg1.data;
    }
  } else {
    this.item = new Fleur.Text();
    this.item.data = "";
  }
  this.item.schemaTypeInfo = Fleur.Type_string;
  return this;
};

Fleur.XPathFunctions_fn["substring-after#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:substring-after",
  function(a, b) {
    if (!a) {
      return "";
    }
    if (!b || b === "") {
      return a;
    }
    var index = a.indexOf(b);
    return index === -1 ? "" : a.substring(index + b.length);
  },
  null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_string, occurence: "?"});

Fleur.XPathFunctions_fn["substring-after#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:substring-after",
  function(a, b, collation) {
    var c = Fleur.getCollation(collation);
    if (!c) {
      var e = new Error("");
      e.name = "FOCH0002";
      return e;
    }
    if (!a) {
      return "";
    }
    if (!b || b === "") {
      return a;
    }
    return c.substringAfter(a, b);
  },
  null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_string, occurence: "?"});