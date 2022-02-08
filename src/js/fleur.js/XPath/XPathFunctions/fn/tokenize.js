"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.fn_tokenize_1 = {
  need_ctx: false,
  is_async: false,
  return_type: {
    nodeType: Fleur.Node.TEXT_NODE,
    schemaTypeInfo: Fleur.Type_string,
    occurrence: "*"
  },
  params_type: [
    {
      nodeType: Fleur.Node.TEXT_NODE,
      schemaTypeInfo: Fleur.Type_string,
      occurrence: "?"
    }
  ]
};
Fleur.signatures.fn_tokenize_2 = {
  need_ctx: false,
  is_async: false,
  return_type: {
    nodeType: Fleur.Node.TEXT_NODE,
    schemaTypeInfo: Fleur.Type_string,
    occurrence: "*"
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
      occurrence: "1"
    }
  ]
};
Fleur.signatures.fn_tokenize_3 = {
  need_ctx: false,
  is_async: false,
  return_type: {
    nodeType: Fleur.Node.TEXT_NODE,
    schemaTypeInfo: Fleur.Type_string,
    occurrence: "*"
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
      occurrence: "1"
    },
    {
      nodeType: Fleur.Node.TEXT_NODE,
      schemaTypeInfo: Fleur.Type_string,
      occurrence: "1"
    }
  ]
};

Fleur.Context.prototype.fn_tokenize_1 = function() {
  const seq = new Fleur.Sequence();
  if (this.item.isNotEmpty() && this.item.data !== "") {
    const input = this.item.data.trim().replace(/\s+/g, " ").split(" ");
    input.forEach(inp => {
      const n = new Fleur.Text();
      n.data = inp;
      n.schemaTypeInfo = Fleur.Type_string;
      seq.appendChild(n);
    });
  }
  this.item = seq.singleton();
  return this;
};
Fleur.Context.prototype.fn_tokenize_2 = function() {
  this.xqx_stringConstantExpr("").fn_tokenize_3();
  return this;
};
Fleur.Context.prototype.fn_tokenize_3 = function() {
  const arg3 = this.item;
  const arg2 = this.itemstack.pop();
  const arg1 = this.itemstack.pop();
  const seq = new Fleur.Sequence();
  if (arg1.isNotEmpty() && arg1.data !== "") {
    const pattern = new RegExp(arg2.data, arg3.data);
    const input = arg1.data.split(pattern);
    input.forEach(function(t) {
      if (t !== undefined && !pattern.test(t)) {
        const n = new Fleur.Text();
        n.data = t;
        n.schemaTypeInfo = Fleur.Type_string;
        seq.appendChild(n);
      }
    });
  }
  this.item = seq.singleton();
  return this;
};

Fleur.XPathFunctions_fn["tokenize#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:tokenize",
  function(input) {
    if (!input || input === "") {
      return null;
    }
    input = input.split(" ");
    if (input[0] === "") {
      input.splice(0, 1);
    }
    if (input[input.length - 1] === "") {
      input.pop();
    }
    return input.length === 1 ? input[0] : input;
  },
  null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_string, occurence: "*"});

Fleur.XPathFunctions_fn["tokenize#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:tokenize",
  function(input, pattern) {
    return Fleur.XPathFunctions_fn["tokenize#3"].jsfunc(input, pattern, "");
  },
  null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_string, occurence: "*"});

Fleur.XPathFunctions_fn["tokenize#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:tokenize",
  function(input, pattern, flags) {
    pattern = new RegExp(pattern, flags);
    if (!input || input === "") {
      return null;
    }
    input = input.split(pattern);
    var result = [];
    input.forEach(function(t) {
      if (t !== undefined && !pattern.test(t)) {
        result.push(t);
      }
    });
    return result.length === 0 ? "" : result.length === 1 ? result[0] : result;
  },
  null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_string, occurence: "*"});