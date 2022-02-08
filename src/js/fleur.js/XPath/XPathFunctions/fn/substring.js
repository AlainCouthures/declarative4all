"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
 Fleur.signatures.fn_substring_2 = {
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
      schemaTypeInfo: Fleur.Type_integer,
      occurrence: "1"
    }
  ]
};
Fleur.signatures.fn_substring_3 = {
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
      schemaTypeInfo: Fleur.Type_integer,
      occurrence: "1"
    },
    {
      nodeType: Fleur.Node.TEXT_NODE,
      schemaTypeInfo: Fleur.Type_integer,
      occurrence: "1"
    }
  ]
};

Fleur.Context.prototype.fn_substring_2 = function() {
  const arg2 = this.item;
  const arg1 = this.itemstack.pop();
  if (arg1.isNotEmpty()) {
    this.item.data = arg1.data.substr(Number(arg2.data) - 1);
  } else {
    this.item = new Fleur.Text();
    this.item.data = "";
  }
  this.item.schemaTypeInfo = Fleur.Type_string;
  return this;
};
Fleur.Context.prototype.fn_substring_3 = function() {
  const arg3 = this.item;
  const arg2 = this.itemstack.pop();
  const arg1 = this.itemstack.pop();
  if (arg1.isNotEmpty()) {
    this.item.data = arg1.data.substr(Number(arg2.data) - 1, Number(arg3.data));
  } else {
    this.item = new Fleur.Text();
    this.item.data = "";
  }
  this.item.schemaTypeInfo = Fleur.Type_string;
  return this;
};

Fleur.XPathFunctions_fn["substring#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:substring",
  function(source, start) {
    return source ? source.substr(Number(start) - 1) : "";
  },
  null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_integer}], false, false, {type: Fleur.Type_string, occurence: "?"});


Fleur.XPathFunctions_fn["substring#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:substring",
  function(source, start, end) {
    return source ? source.substr(Number(start) - 1, Number(end)) : "";
  },
  null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_integer}, {type: Fleur.Type_integer}], false, false, {type: Fleur.Type_string, occurence: "?"});